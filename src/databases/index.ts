import { InRootState, ActionType } from '../@types/redux';
import { createStore, combineReducers } from 'redux';
import { getEnvConfig } from '../tools';
import { configReducer } from './reducers/config';
import { TypeDataBaseConfig } from '../@types/database';


const rootReducers = combineReducers<InRootState, ActionType<TypeDataBaseConfig>>({
  config: configReducer,
});

const dataStore = createStore(rootReducers);

dataStore.subscribe(() => {
  localStorage.setItem(getEnvConfig.SAVE_DATABASE_NAME, JSON.stringify(dataStore.getState()));
});

export default dataStore;
