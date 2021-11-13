import { useState, useEffect } from 'react';
import useGetDispatch from '../databases/hook';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';
import { InRootState } from '../@types/redux';
import { getEnvConfig } from '../tools';

const useI18 = (text: string): string => {
  const [ result, setResult ] = useState('');
  const [ { language } ] = useGetDispatch<InRootState['config']>('config');
  const [ json, setJson ] = useState<{[key: string]: string}>({});
  useEffect(() => {
    switch (language) {
    case 'zh-CN':
      setJson(zhCN);
      break;
    case 'en-US':
      setJson(enUS);
      break;
    }
  }, [ language, setJson ]);
  useEffect(() => {
    const reg = new RegExp(`\\$TOKEN`, 'g');
    if (json[text]) {
      setResult(json[text].replace(reg, getEnvConfig.APP_TOKEN_NAME_VIEW));
    }
  }, [ json, text ]);
  return result;
};

export default useI18;