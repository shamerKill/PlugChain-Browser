import { FC, useEffect, useState } from 'react';
import { InRootState } from '../@types/redux';
import useGetDispatch from '../databases/hook';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';

const I18: FC<{ text: string }> = ({ text }) => {
  const [{ language }] = useGetDispatch<InRootState['config']>('config');
  const [json, setJson] = useState<{[key: string]: string}>({});
  useEffect(() => {
    switch (language) {
      case 'zh-CN':
        setJson(zhCN);
        break;
      case 'en-US':
        setJson(enUS);
        break;
    }
  }, [language, setJson]);
  return (
    <span>
      { json[text] }
    </span>
  );
};

export default I18;
