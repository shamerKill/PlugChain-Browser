import React, { FC, ButtonHTMLAttributes, useState } from 'react';
import { formatClass } from '../../../tools';
import ComConLoading from './loading';

import './control.scss';

export type TypeComponentsControlButton = {
  loading?: boolean;
  contrast?: boolean;
  doubles?: boolean;
};

const ComConButton: FC<TypeComponentsControlButton & ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  onClick,
  className,
  loading,
  contrast,
  disabled,
  doubles,
}) => {
  const [timer, setTimer] = useState<number>(0);
  const doClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (!doubles) return onClick?.(event);
    // double click 
    if (timer === 0) return setTimer(new Date().getTime()); 
    else {
      if (new Date().getTime() - timer < 500) onClick?.(event);
      else setTimer(0);
    }
  };
  return (
    <button
      className={formatClass(['control-button', contrast && 'control-button-contrast', loading && 'control-button-disabled', className])}
      onClick={doClick}
      disabled={disabled || loading}>
      { children }
      <ComConLoading visible={loading} />
    </button>
  );
};

export default ComConButton;
