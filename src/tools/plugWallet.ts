/* eslint-disable id-length */
import { DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions } from '@cosmjs/proto-signing';
import {
  Bip39,
  HdPath,
  Slip10RawIndex,
  stringToPath,
  EnglishMnemonic,
  pathToString,
  Secp256k1Keypair,
  Slip10,
  Slip10Curve,
  Secp256k1,
  Random,
} from '@cosmjs/crypto';
import { AccountData } from '@cosmjs/proto-signing/build/signer';
import { DirectSecp256k1HdWalletSerialization } from '@cosmjs/proto-signing/build/directsecp256k1hdwallet';
import { decrypt, encrypt, KdfConfiguration, EncryptionConfiguration, supportedAlgorithms, executeKdf } from '@cosmjs/proto-signing/build/wallet';
import { keccak256, bufferToHex, BN } from 'ethereumjs-util';
import bech32 from 'bech32';
import { makeCosmoshubPath, rawSecp256k1PubkeyToRawAddress } from '@cosmjs/amino';
import { assert, isNonNullObject } from '@cosmjs/utils';
import { fromBase64, fromUtf8, toBase64, Bech32, toUtf8 } from '@cosmjs/encoding';
import { Buffer } from 'buffer';


const serializationTypeV1 = 'directsecp256k1hdwallet-v1';


export type PlugAlgo = 'secp256k1' | 'ed25519' | 'sr25519' | 'eth_secp256k1';

interface AccountDataWithPrivkey extends AccountData {
  readonly privkey: Uint8Array;
  readonly hexAddress?: string;
}

interface DerivationInfoJson {
  readonly hdPath: string;
  readonly prefix: string;
}

function isDerivationJson(thing: unknown): thing is DerivationInfoJson {
  if (!isNonNullObject(thing)) return false;
  if (typeof (thing as DerivationInfoJson).hdPath !== 'string') return false;
  if (typeof (thing as DerivationInfoJson).prefix !== 'string') return false;
  return true;
}

interface Secp256k1Derivation {
  readonly hdPath: HdPath;
  readonly prefix: string;
  readonly accountType: 'evm'|'default';
}

export interface PlugDirectSecp256k1HdWalletOptions extends DirectSecp256k1HdWalletOptions {
  // 账户类型 evm或者默认cosmos
  readonly accountType: 'evm'|'default';
}

interface DirectSecp256k1HdWalletData {
  readonly mnemonic: string;
  readonly accounts: readonly DerivationInfoJson[];
}

const defaultEthHdPath: HdPath[] = [ [
  Slip10RawIndex.hardened(44),
  Slip10RawIndex.hardened(60),
  Slip10RawIndex.hardened(0),
  Slip10RawIndex.normal(0),
  Slip10RawIndex.normal(0),
] ];
interface DirectSecp256k1HdWalletConstructorOptions extends Partial<PlugDirectSecp256k1HdWalletOptions> {
  readonly seed: Uint8Array;
}


const defaultOptions: PlugDirectSecp256k1HdWalletOptions = {
  bip39Password: '',
  hdPaths: [ makeCosmoshubPath(0) ],
  prefix: 'cosmos',
  accountType: 'default',
};

// eslint-disable-next-line id-length
export class PlugDirectSecp256k1HdWallet extends DirectSecp256k1HdWallet {
  /** Base secret */
  private readonly plugSecret: EnglishMnemonic;
  /** BIP39 seed */
  private readonly plugSeed: Uint8Array;
  /** Derivation instructions */
  private readonly plugAccounts: readonly Secp256k1Derivation[];
  constructor(mnemonic: EnglishMnemonic, options: DirectSecp256k1HdWalletConstructorOptions) {
    super(mnemonic, options as any);
    const prefix = options.prefix ?? defaultOptions.prefix;
    const accountType = options.accountType ?? defaultOptions.accountType;
    const hdPaths = options.hdPaths ?? (
      accountType === 'evm' ? defaultEthHdPath : defaultOptions.hdPaths
    );
    this.plugSecret = mnemonic;
    this.plugSeed = options.seed;
    this.plugAccounts = hdPaths.map(hdPath => ({
      hdPath: hdPath,
      prefix: prefix,
      accountType: accountType,
    }));
  }

  public static async fromMnemonic(mnemonic: string,
    options: Partial<PlugDirectSecp256k1HdWalletOptions> = {}): Promise<PlugDirectSecp256k1HdWallet> {
    const mnemonicChecked = new EnglishMnemonic(mnemonic);
    const seed = await Bip39.mnemonicToSeed(mnemonicChecked, options.bip39Password);
    return new PlugDirectSecp256k1HdWallet(mnemonicChecked, {
      ...options,
      seed: seed,
    });
  }

  // eslint-disable-next-line id-length
  public static async deserializeWithEncryptionKey(serialization: string,
    encryptionKey: Uint8Array): Promise<DirectSecp256k1HdWallet> {
    const root = JSON.parse(serialization);
    if (!isNonNullObject(root)) throw new Error('Root document is not an object.');
    const untypedRoot: any = root;
    switch (untypedRoot.type) {
    case serializationTypeV1: {
      const decryptedBytes = await decrypt(
        fromBase64(untypedRoot.data),
        encryptionKey,
        untypedRoot.encryption,
      );
      const decryptedDocument = JSON.parse(fromUtf8(decryptedBytes));
      const { mnemonic, accounts } = decryptedDocument;
      assert(typeof mnemonic === 'string');
      if (!Array.isArray(accounts)) throw new Error('Property \'accounts\' is not an array');
      if (!accounts.every(account => isDerivationJson(account)))
        throw new Error('Account is not in the correct format.');

      const firstPrefix = accounts[0].prefix;
      const accountType = accounts[0].accountType;
      if (!accounts.every(({ prefix }) => prefix === firstPrefix))
        throw new Error('Accounts do not all have the same prefix');

      const hdPaths = accounts.map(({ hdPath }) => stringToPath(hdPath));
      return PlugDirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        hdPaths: hdPaths,
        prefix: firstPrefix,
        accountType: accountType,
      });
    }
    default:
      throw new Error('Unsupported serialization type');
    }
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    const accountsWithPrivkeys = await this.plugGetAccountsWithPrivkeys();
    return accountsWithPrivkeys.map(({ algo, pubkey, address, hexAddress }) => ({
      algo: algo,
      pubkey: pubkey,
      address: address,
      hexAddress: hexAddress,
    }));
  }

  // eslint-disable-next-line id-length
  public async serializeWithEncryptionKey(encryptionKey: Uint8Array,
    kdfConfiguration: KdfConfiguration): Promise<string> {
    const dataToEncrypt: DirectSecp256k1HdWalletData = {
      mnemonic: this.mnemonic,
      accounts: this.plugAccounts.map(({ hdPath, prefix, accountType }) => ({
        hdPath: pathToString(hdPath),
        prefix: prefix,
        accountType: accountType,
      })),
    };
    const dataToEncryptRaw = toUtf8(JSON.stringify(dataToEncrypt));

    const encryptionConfiguration: EncryptionConfiguration = {
      algorithm: supportedAlgorithms.xchacha20poly1305Ietf,
    };
    const encryptedData = await encrypt(
      dataToEncryptRaw, encryptionKey, encryptionConfiguration,
    );

    const out: DirectSecp256k1HdWalletSerialization = {
      type: serializationTypeV1,
      kdf: kdfConfiguration,
      encryption: encryptionConfiguration,
      data: toBase64(encryptedData),
    };
    return JSON.stringify(out);
  }

  public static async generate(length: 12 | 15 | 18 | 21 | 24 = 12,
    options: Partial<PlugDirectSecp256k1HdWalletOptions> = {}): Promise<PlugDirectSecp256k1HdWallet> {
    const entropyLength = 4 * Math.floor((11 * length) / 33);
    const entropy = Random.getBytes(entropyLength);
    const mnemonic = Bip39.encode(entropy);
    return PlugDirectSecp256k1HdWallet.fromMnemonic(mnemonic.toString(), options);
  }

  public static async deserialize(serialization: string, password: string): Promise<PlugDirectSecp256k1HdWallet> {
    const root = JSON.parse(serialization);
    if (!isNonNullObject(root)) throw new Error('Root document is not an object.');
    switch ((root as any).type) {
    case serializationTypeV1:
      return PlugDirectSecp256k1HdWallet.PlugDeserializeTypeV1(serialization, password);
    default:
      throw new Error('Unsupported serialization type');
    }
  }


  protected static async PlugDeserializeTypeV1(serialization: string,
    password: string): Promise<PlugDirectSecp256k1HdWallet> {
    const root = JSON.parse(serialization);
    if (!isNonNullObject(root)) throw new Error('Root document is not an object.');
    const encryptionKey = await executeKdf(password, (root as any).kdf);
    return PlugDirectSecp256k1HdWallet.plugDeserializeWithEncryptionKey(serialization, encryptionKey);
  }

  // eslint-disable-next-line no-dupe-class-members
  public static async plugDeserializeWithEncryptionKey(serialization: string,
    encryptionKey: Uint8Array): Promise<PlugDirectSecp256k1HdWallet> {
    const root = JSON.parse(serialization);
    if (!isNonNullObject(root)) throw new Error('Root document is not an object.');
    const untypedRoot: any = root;
    switch (untypedRoot.type) {
    case serializationTypeV1: {
      const decryptedBytes = await decrypt(
        fromBase64(untypedRoot.data),
        encryptionKey,
        untypedRoot.encryption,
      );
      const decryptedDocument = JSON.parse(fromUtf8(decryptedBytes));
      const { mnemonic, accounts } = decryptedDocument;
      assert(typeof mnemonic === 'string');
      if (!Array.isArray(accounts)) throw new Error('Property \'accounts\' is not an array');
      if (!accounts.every(account => isDerivationJson(account)))
        throw new Error('Account is not in the correct format.');

      const firstPrefix = accounts[0].prefix;
      const accountType = accounts[0].accountType;
      if (!accounts.every(({ prefix }) => prefix === firstPrefix))
        throw new Error('Accounts do not all have the same prefix');

      const hdPaths = accounts.map(({ hdPath }) => stringToPath(hdPath));
      return PlugDirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        hdPaths: hdPaths,
        prefix: firstPrefix,
        accountType: accountType,
      });
    }
    default:
      throw new Error('Unsupported serialization type');
    }
  }

  protected async plugGetKeyPair(hdPath: HdPath): Promise<Secp256k1Keypair> {
    const { privkey } = Slip10.derivePath(
      Slip10Curve.Secp256k1, this.plugSeed, hdPath,
    );
    const { pubkey } = await Secp256k1.makeKeypair(privkey);
    return {
      privkey: privkey,
      pubkey: Secp256k1.compressPubkey(pubkey),
    };
  }

  protected async plugGetAccountsWithPrivkeys(): Promise<readonly AccountDataWithPrivkey[]> {
    return Promise.all(this.plugAccounts.map(async ({ hdPath, prefix, accountType }) => {
      const { privkey, pubkey } = await this.plugGetKeyPair(hdPath);
      let address;
      let algoType: PlugAlgo = 'secp256k1';
      let hexAddress;
      if (accountType === 'evm') {
        algoType = 'eth_secp256k1';
        const realPubkey = (await Secp256k1.makeKeypair(privkey)).pubkey.slice(1);
        const BNPubkey = new BN(realPubkey);
        const pubkey256 = keccak256(Buffer.from(BNPubkey.toArray()));
        hexAddress = bufferToHex(pubkey256.slice(12));
        const encodeHexAddress = Buffer.from(hexAddress.slice(2), 'hex');
        address = bech32.encode('gx', bech32.toWords(encodeHexAddress));
      } else
        address = Bech32.encode(prefix, rawSecp256k1PubkeyToRawAddress(pubkey));

      return {
        algo: algoType as any,
        privkey: privkey,
        pubkey: pubkey,
        address: address,
        hexAddress: hexAddress,
      };
    }));
  }
}