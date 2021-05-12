import { TypeDataBaseConfig } from '../../@types/database';
import localOutput from '../localStorage';

export const changeConfig = 'CHANGE_THEME';

export const defaultConfig: TypeDataBaseConfig = localOutput.config || {
  theme: 'light',
  language: 'zh-CN',
};