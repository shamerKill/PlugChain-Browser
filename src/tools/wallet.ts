import { DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions } from '@cosmjs/proto-signing';
import { SigningStargateClient, accountFromAny, Account } from '@cosmjs/stargate';
import minimal from 'protobufjs/minimal';
import base64js from 'base64-js';
import { QueryAccountResponse } from '@cosmjs/stargate/build/codec/cosmos/auth/v1beta1/query';
import { TxRaw } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx';
import { fetchData } from './ajax';
import getEnvConfig from './env-config';
import { randomNumber } from './random-num';
import { toHex } from './string';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { changeSeconds } from './time';

const rpcURI = getEnvConfig.WALLET_RPC_BASE;
const appTokenName = getEnvConfig.APP_TOKEN_NAME;
const addressPrefix = getEnvConfig.WALLET_ADDRESS_PREFIX;
const chainId = getEnvConfig.APP_CHAIN_ID;

const defaultTransGasLimit = '100000';

export const walletCreate = async () => {
  const newWallet = await DirectSecp256k1HdWallet.generate(24, { prefix: addressPrefix });
  return newWallet;
};

export const walletEncode = async (wallet: DirectSecp256k1HdWallet, password: string) => {
  const encodeStr = await wallet.serialize(password);
  return encodeStr;
};

export const walletDecode = async (encodeStr: string, password: string) => {
  const backWallet = await DirectSecp256k1HdWallet.deserialize(encodeStr, password);
  return backWallet;
};

export const walletToAddress = async (wallet: DirectSecp256k1HdWallet) => {
  const [ { address } ] = await wallet.getAccounts();
  return address;
};

export const walletToMnemonic = async (wallet: DirectSecp256k1HdWallet) => wallet.mnemonic;

export const walletFormMnemonic = async (mnemonic: string, options?: Partial<DirectSecp256k1HdWalletOptions>) => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: addressPrefix, ...options });
  return wallet;
};

export const walletGetOffline = async (wallet: DirectSecp256k1HdWallet) => {
  const client = await SigningStargateClient.offline(wallet);
  return client;
};

export const walletAddressToHex = (address: string) => toHex(minimal.Writer.create().uint32(10).string(address).finish());

export const walletGetAccountInfo = async (wallet: DirectSecp256k1HdWallet) => new Promise<Account>((resolve, reject) => {
  (async () => {
    const address = await walletToAddress(wallet);
    walletFetch('abci_query', {
      path: '/cosmos.auth.v1beta1.Query/Account',
      data: walletAddressToHex(address),
      height: undefined,
      prove: false,
    }).subscribe(({ error, success, data, message }) => {
      if (success && data.response.code === 0) {
        const reader = new minimal.Reader(base64js.toByteArray(data.response.value));
        const decodeData = QueryAccountResponse.decode(reader).account;
        if (decodeData) resolve(accountFromAny(decodeData));
        else reject(data.response);
      } else if (success && data.response.code !== 0) reject(data.response);
      if (error) reject(message);
    });
  })();
});


export const walletSign = async ({ wallet, toAddress, volume, memo = '', gasLimit = defaultTransGasLimit }:
  { wallet: DirectSecp256k1HdWallet; toAddress: string; volume: string; memo: string; gasLimit: string; }) => {
  const account = await walletGetAccountInfo(wallet);
  const result = await (await walletGetOffline(wallet)).sign(
    account.address, [ {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: account.address,
        toAddress: toAddress,
        amount: [ { amount: volume, denom: appTokenName } ],
      },
    } ], { amount: [ {
      denom: appTokenName,
      amount: '1',
    } ], gas: gasLimit }, memo, {
      accountNumber: account.accountNumber,
      sequence: account.sequence,
      chainId: chainId,
    },
  );
  const raw = TxRaw.encode(result).finish();
  const rawTx = base64js.fromByteArray(raw);
  return rawTx;
};

export const walletTransfer = ({ wallet, toAddress, volume, memo = '', gasLimit = defaultTransGasLimit }:
  { wallet: DirectSecp256k1HdWallet; toAddress: string; volume: string; memo?: string; gasLimit?: string; }) => {
  // result: tx push result; success: tx success in chain; loading: tx loading in chain;
  const resultObserver = new BehaviorSubject<{ result: any; success: boolean; loading: boolean; error: boolean; }>({ result: null, success: false, loading: false, error: false });
  walletSign({ wallet, toAddress, volume, memo, gasLimit }).then(txRaw => {
    walletFetch('broadcast_tx_async', { tx: txRaw }).subscribe(({ success, data }) => {
      if (success) resultObserver.next({...resultObserver.getValue(), result: data, loading: true});
    });
    let watchLoading: Subscription|null = null;
    const resultSubscription = resultObserver.subscribe(({ loading, result, success }) => {
      if (loading && result && result.code === 0 && result.hash) watchLoading = timer(0, changeSeconds(3)).subscribe(() => {
        walletFetch('tx_search', { query: `tx.hash='${result.hash}'`, page: '1' }).subscribe(search => {
          if (search.success && search.data.total_count !== '0') {
            resultObserver.next({error: false, result: search.data.txs, loading: false, success: true});
            watchLoading?.unsubscribe();
            resultSubscription.unsubscribe();
          }
        });
      });
      else if (success) {
        if (watchLoading) watchLoading.unsubscribe();
        resultSubscription.unsubscribe();
      }
    });
  });
  return resultObserver;
};

export const formatTokenVolume = (volume: string|number, tokenName: string = appTokenName) => {
  let volumeStr = typeof volume === 'number' ? volume.toString() : volume;
  const amount = {
    denom: tokenName,
    amount: volumeStr,
  };
  return amount;
};

const walletFetch = (method: string, params: { [key: string]: any}) => fetchData(
  'POST', rpcURI, {
    jsonrpc: '2.0',
    id: randomNumber(),
    method: method,
    params: params,
  }, true,
);