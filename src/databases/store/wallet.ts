import { TypeDataBaseWallet } from '../../@types/database';
import { accountTypeEnum } from '../../app/components/control/accountsType';
import localOutput from '../localStorage';

export const changeWallet = 'CHANGE_ACCOUNT';


export const defaultWallet: TypeDataBaseWallet = localOutput.wallet ? {
  type: accountTypeEnum.prc20,
  ...localOutput.wallet,
} : {
  hasWallet: false,
  encryptionKey: '',
  address: '',
  type: accountTypeEnum.prc20,
};