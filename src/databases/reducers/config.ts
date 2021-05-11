import { TypeDataBaseConfig } from '../../@types/database';
import { defaultConfig, changeConfig } from '../store/config';
import { SelfReducersType } from '../../@types/redux';

export const configReducer: SelfReducersType<TypeDataBaseConfig> = (state = defaultConfig, action) => {
  switch (action.type) {
  case changeConfig:
    return {
      ...state,
      ...action.data,
    };
  default:
    return state;
  }
};