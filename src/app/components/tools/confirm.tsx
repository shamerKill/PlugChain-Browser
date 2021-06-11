import React, { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { formatClass, getOnlyId } from '../../../tools';
import ComConSvg from '../control/icon';
import I18 from '../../../i18n/component';

import './tools.scss';

const confirmTools: {
  create: (arg: TypeConfirmArg) => (() => void)
} = {
  create: () => (() => {})
};

export default confirmTools;

// TODO： confirm
type TypeConfirmButton = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> | {text: string; onClick?: () => void;};
type TypeConfirmArg = {
  message: ReactElement | string;
  close?: () => void;
  buttons?: TypeConfirmButton[];
};

const ComToolConfirm: FC<TypeConfirmArg> = ({message, close, buttons}) => {
  const [closeIng, setCloseIng] = useState<boolean>(false);
  useEffect(() => {
    if (closeIng) {
      const timerClose = setTimeout(() => close?.(), 300);
      return () => clearTimeout(timerClose);
    }
  }, [closeIng, close]);
  return (
    <div className={formatClass([
      'com-con-tool-confirm',
      closeIng && 'com-con-tool-confirm-close',
    ])}>
      <button className="com-tool-alert-close" onClick={() => setCloseIng(true)}><ComConSvg xlinkHref="#icon-close" /></button>
      <p className="com-tool-confirm-message">{message}</p>
      {
        buttons?.map(button => button)
      }
    </div>
  );
};

export const ComToolConfirmBox: FC = () => {
  const alertBox = useRef(null);
  const [alertObj, setAlertObj] = useState<{[key: string]: ReactElement}>({});
  const [alertList, setAlertList] = useState<ReactElement[]>([]);
  confirmTools.create = useCallback((arg) => {
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
    let buttons = arg.buttons;
    if (buttons === undefined) {
      buttons = [
        <button key={getOnlyId()} onClick={close}><I18 text="close"/></button>,
        <button key={getOnlyId()} onClick={close}><I18 text="confirm"/></button>
      ];
    } else if ((buttons[0] as any)?.text) {
      buttons = buttons.map((item: any) => {
        return <button key={getOnlyId()} onClick={item.onClick}>{ item.text }</button>
      })
    }
    // create reactElement
    const alertEle = <ComToolConfirm key={key} {...arg} close={close} />;
    // add element to html
    setAlertObj(state => ({[key]: alertEle, ...state}));
    return close;
  }, [alertList]);
  useEffect(() => {
    setAlertList(Object.values(alertObj));
  }, [alertObj]);
  return (
    <div ref={alertBox} id="com-use-confirm-root">{ alertList }</div>
  );
};