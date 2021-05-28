import { InRootState, ActionType } from '../@types/redux';
import { createStore, combineReducers } from 'redux';
import { configReducer } from './reducers/config';
import { TypeDataBaseConfig, TypeDataBaseWallet } from '../@types/database';
import { walletReducer } from './reducers/wallet';
import { saveLocalData } from './localStorage';


const rootReducers = combineReducers<InRootState, ActionType<TypeDataBaseConfig&TypeDataBaseWallet>>({
  config: configReducer,
  wallet: walletReducer,
});

const dataStore = createStore(rootReducers);

dataStore.subscribe(() => {
  saveLocalData(JSON.stringify(dataStore.getState()));
});

export default dataStore;
