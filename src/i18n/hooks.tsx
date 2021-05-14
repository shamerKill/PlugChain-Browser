import { useState, useEffect } from 'react';
import useGetDispatch from '../databases/hook';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';
import { InRootState } from '../@types/redux';

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
    setResult(json[text]);
  }, [ json, text ]);
  return result;
};

export default useI18;