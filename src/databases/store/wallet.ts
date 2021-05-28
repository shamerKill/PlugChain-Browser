import { TypeDataBaseWallet } from '../../@types/database';
import localOutput from '../localStorage';

export const changeWallet = 'CHANGE_ACCOUNT';

export const defaultWallet: TypeDataBaseWallet = localOutput.wallet || {
  hasWallet: false,
  encryptionKey: '',
  address: '',
};