import { TypeDataBaseWallet } from '../../@types/database';
import { defaultWallet, changeWallet } from '../store/wallet';
import { SelfReducersType } from '../../@types/redux';

export const walletReducer: SelfReducersType<TypeDataBaseWallet> = (state = defaultWallet, action) => {
  switch (action.type) {
  case changeWallet:
    return {
      ...state,
      ...action.data,
    };
  default:
    return state;
  }
};