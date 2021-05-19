import { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import I18 from '../../../i18n/component';
import { getOnlyId } from '../../../tools';

import './tools.scss';

const alertTools: {
  create: (arg: TypeAlertArg) => (() => void)
} = {
  create: () => (() => {})
};

export default alertTools;

type TypeAlertButton = {text: string; onClick?: () => void;};
type TypeAlertArg = {
  message: ReactElement | string;
  buttons?: (ReactElement|TypeAlertButton)[];
};

const ComToolAlert: FC<TypeAlertArg> = ({message, buttons}) => {
  return (
    <div>{message}{buttons?.map(item => item)}</div>
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
    let buttons = arg.buttons;
    if (buttons === undefined) {
      buttons = [
        <button key={getOnlyId()} onClick={close}><I18 text="close"/></button>,
        <button key={getOnlyId()} onClick={close}><I18 text="confirm"/></button>
      ];
    } else if ((buttons[0] as TypeAlertButton).text) {
      buttons = (buttons as TypeAlertButton[]).map((item) => {
        return <button key={getOnlyId()} onClick={item.onClick}>{ item.text }</button>
      })
    }
    // create reactElement
    const alertEle = <ComToolAlert key={key} {...arg} buttons={buttons} />;
    // add element to html
    setAlertObj(state => ({...state, [key]: alertEle}));
    return close;
  }, [alertList]);
  useEffect(() => {
    setAlertList(Object.values(alertObj));
  }, [alertObj]);
  return (
    <div ref={alertBox} id="com-use-alert-root">{ alertList }</div>
  );
};