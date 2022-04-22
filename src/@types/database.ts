import { typeAccountType } from '../app/components/control/accountsType';

export type TypeDataBaseConfig = {
  theme: 'light'|'dark';
  language: 'zh-CN'|'en-US';
};

export type TypeDataBaseWallet = {
  hasWallet: boolean;
  encryptionKey: string;
  address: string;
  type?: typeAccountType;
};