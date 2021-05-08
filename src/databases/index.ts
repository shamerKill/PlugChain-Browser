import { InRootState, ActionType } from './../@types/redux.d';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { getEnvConfig } from '../tools';

const epicMiddleware = createEpicMiddleware();

const rootReducers = combineReducers<InRootState, ActionType<any>>({
});

const dataStore = createStore(rootReducers, applyMiddleware(epicMiddleware));

epicMiddleware.run(combineEpics());

dataStore.subscribe(() => {
  localStorage.setItem(getEnvConfig.SAVE_DATABASE_NAME, JSON.stringify(dataStore.getState()));
});

export default dataStore;
