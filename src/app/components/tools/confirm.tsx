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

type TypeConfirmButton = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> | {text: string; onClick?: () => void;};
type TypeConfirmArg = {
  message: ReactElement | string;
  success?: () => void;
  close?: () => void;
  buttons?: TypeConfirmButton[];
};

const ComToolConfirm: FC<TypeConfirmArg> = ({message, close, buttons}) => {
  const [closeIng, setCloseIng] = useState<boolean>(false);
  useEffect(() => {
    if (closeIng) {
      const timerClose = setTimeout(() => {
        setCloseIng(false);
        close?.();
      }, 300);
      return () => {
        setCloseIng(false);
        clearTimeout(timerClose)
      };
    }
  }, [closeIng, close]);
  return (
    <div className={formatClass([
      'com-con-tool-confirm',
      closeIng && 'com-con-tool-confirm-close',
    ])}>
      <button className="com-tool-alert-close" onClick={() => setCloseIng(true)}><ComConSvg xlinkHref="#icon-close" /></button>
      <div className="com-tool-confirm-message">{message}</div>
      <div className="com-tool-confirm-buttons">
        {
          buttons?.map(button => button)
        }
      </div>
    </div>
  );
};

export const ComToolConfirmBox: FC = () => {
  const alertBox = useRef(null);
  const double = useRef(0);
  const [alertShow, setAlertShow] = useState(false);
  const [confirmInfo, setConfirmInfo] = useState<TypeConfirmArg>({ message: '' });
  confirmTools.create = useCallback((arg) => {
    setAlertShow(true);
    double.current = 0;
    // close function
    const close = (success: boolean) => {
      if (success && arg.success && double.current === 0) arg.success();
      if (success === false && arg.close && double.current === 0) arg.close();
      double.current = double.current + 1;
      setAlertShow(false);
    };
    // default buttons
    let buttonsGet = arg.buttons;
    if (buttonsGet === undefined) {
      buttonsGet = [
        <button className="com-confirm-close" key={getOnlyId()} onClick={() => close(false)}><I18 text="close"/></button>,
        <button className="com-confirm-success" key={getOnlyId()} onClick={() => close(true)}><I18 text="confirm"/></button>
      ];
    } else if ((buttonsGet[0] as any)?.text) {
      buttonsGet = buttonsGet.map((item: any) => {
        return <button className="com-confirm-success" key={getOnlyId()} onClick={item.onClick}>{ item.text }</button>
      })
    }
    setConfirmInfo({ ...arg, close: () => close(false), buttons: buttonsGet });
    return () => close(false);
  }, []);
  return (
    <div ref={alertBox} id="com-use-confirm-root" className={formatClass([alertShow && 'com-use-confirm-show'])}>
      <ComToolConfirm {...confirmInfo} />
    </div>
  );
};