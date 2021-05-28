import { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { formatClass, getOnlyId } from '../../../tools';
import ComConSvg from '../control/icon';

import './tools.scss';

const alertTools: {
  create: (arg: TypeAlertArg) => (() => void)
} = {
  create: () => (() => {})
};

export default alertTools;

// type TypeAlertButton = {text: string; onClick?: () => void;};
type TypeAlertArg = {
  message: ReactElement | string;
  type?: 'info'|'warning'|'error';
  time?: number;
  close?: () => void;
};

const ComToolAlert: FC<TypeAlertArg> = ({message, close, time = 5000, type = 'info'}) => {
  const [closeIng, setCloseIng] = useState<boolean>(false);
  useEffect(() => {
    if (!time) return;
    const timer = setTimeout(() => setCloseIng(true), time);
    return () => {
      clearTimeout(timer);
    };
  }, [time]);
  useEffect(() => {
    if (closeIng) {
      const timerClose = setTimeout(() => close?.(), 300);
      return () => clearTimeout(timerClose);
    }
  }, [closeIng, close]);
  return (
    <div className={formatClass([
      'com-con-tool-alert',
      closeIng && 'com-con-tool-alert-close',
      type === 'info' && 'com-con-tool-alert-info',
      type === 'error' && 'com-con-tool-alert-error',
      type === 'warning' && 'com-con-tool-alert-warning'
    ])}>
      <p className="com-tool-alert-message">{message}</p>
      <button className="com-tool-alert-close" onClick={() => setCloseIng(true)}><ComConSvg xlinkHref="#icon-close" /></button>
    </div>
  );
};

export const ComToolAlertBox: FC = () => {
  const alertBox = useRef(null);
  const [alertObj, setAlertObj] = useState<{[key: string]: ReactElement}>({});
  const [alertList, setAlertList] = useState<ReactElement[]>([]);
  alertTools.create = useCallback((arg) => {
    const key = `${alertList.length}${getOnlyId()}`;
    // close function
    const close = () => {
      setAlertObj(state => {
        const result: typeof alertObj = {};
        Object.keys(state).forEach(item => {
          if (item !== key) result[item] = state[item];
        });
        return result;
      });
    };
    // default buttons
    // let buttons = arg.buttons;
    // if (buttons === undefined) {
    //   buttons = [
    //     <button key={getOnlyId()} onClick={close}><I18 text="close"/></button>,
    //     <button key={getOnlyId()} onClick={close}><I18 text="confirm"/></button>
    //   ];
    // } else if ((buttons[0] as TypeAlertButton).text) {
    //   buttons = (buttons as TypeAlertButton[]).map((item) => {
    //     return <button key={getOnlyId()} onClick={item.onClick}>{ item.text }</button>
    //   })
    // }
    // create reactElement
    const alertEle = <ComToolAlert key={key} {...arg} close={close} />;
    // add element to html
    setAlertObj(state => ({[key]: alertEle, ...state}));
    return close;
  }, [alertList]);
  useEffect(() => {
    setAlertList(Object.values(alertObj));
  }, [alertObj]);
  return (
    <div ref={alertBox} id="com-use-alert-root">{ alertList }</div>
  );
};