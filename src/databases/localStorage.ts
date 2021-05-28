import { getEnvConfig } from '../tools';
import { InRootState } from '../@types/redux';

const local = localStorage.getItem(getEnvConfig.SAVE_DATABASE_NAME);

let localOutput: InRootState | {[key: string]: any} = {};
if (local) localOutput = JSON.parse(local);
else localOutput = {};

export const saveLocalData = (data: string) => {
  localStorage.setItem(getEnvConfig.SAVE_DATABASE_NAME, data);
};

export default localOutput;
