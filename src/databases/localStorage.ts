import { getEnvConfig } from '../tools';
import { InRootState } from '../@types/redux';

let local: string|null = '';
try {
  local = localStorage.getItem(getEnvConfig.SAVE_DATABASE_NAME);
} catch (err) {
  console.error('err');
}
let localOutput: InRootState | {[key: string]: any} = {};
if (local) localOutput = JSON.parse(local);
else localOutput = {};

export const saveLocalData = (data: string) => {
  localStorage.setItem(getEnvConfig.SAVE_DATABASE_NAME, data);
};

export default localOutput;
