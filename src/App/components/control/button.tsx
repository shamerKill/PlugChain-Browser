import { FC, ButtonHTMLAttributes } from 'react';
import { formatClass } from '../../../tools';

import './control.scss';

export type TypeComponentsControlButton = {
};

const ComConButton: FC<TypeComponentsControlButton & ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  onClick,
}) => {
  return (
    <button className={formatClass(['control-button'])} onClick={onClick}>
      { children }
    </button>
  );
};

export default ComConButton;
