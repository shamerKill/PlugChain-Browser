import getEnvConfig from './env-config';

const getSessionStorage = (): {[key: string]: any} => {
  const data = sessionStorage.getItem(getEnvConfig.SAVE_DATABASE_NAME);
  if (data) try {
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
  return {};
};
export const getSession = <T = null>(key: string): T => getSessionStorage()[key];
export const delSession = (key: string) => {
  const data = getSessionStorage();
  delete data[key];
  sessionStorage.setItem(getEnvConfig.SAVE_DATABASE_NAME, JSON.stringify(data));
};
export const saveSession = (key: string, value: string) => {
  const store = getSessionStorage();
  sessionStorage.setItem(getEnvConfig.SAVE_DATABASE_NAME, JSON.stringify({ ...store, [key]: value }));
};