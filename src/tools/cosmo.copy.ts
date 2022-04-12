import { Pubkey } from '@cosmjs/amino';
import { Uint64 } from '@cosmjs/math';
import { toBase64 } from '@cosmjs/encoding';

export function uint64FromProto(input: any) {
  return Uint64.fromString(input.toString());
}
// eslint-disable-next-line id-length
export function accountFromBaseAccount(input: any) {
  const { address, pubKey, accountNumber, sequence } = input;
  let pubkey: Pubkey | null = null;
  if (pubKey && pubKey.typeUrl === '/ethermint.crypto.v1.ethsecp256k1.PubKey') pubkey = accountPubKeyFormat(pubKey.value);
  return {
    address: address,
    pubkey: pubkey,
    accountNumber: uint64FromProto(accountNumber).toNumber(),
    sequence: uint64FromProto(sequence).toNumber(),
  };
}

export function accountPubKeyFormat(input: Uint8Array) {
  const value = toBase64(input);
  const pubkey: Pubkey = {
    type: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
    value,
  };
  return pubkey;
}