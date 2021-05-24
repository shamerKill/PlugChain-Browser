import { FC, ButtonHTMLAttributes } from 'react';
import { formatClass } from '../../../tools';

import './control.scss';
import ComConLoading from './loading';

export type TypeComponentsControlButton = {
  loading?: boolean;
};

const ComConButton: FC<TypeComponentsControlButton & ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  onClick,
  className,
  loading,
}) => {
  return (
    <button
      className={formatClass(['control-button', loading && 'control-button-disabled', className])}
      onClick={onClick}
      disabled={loading}>
      { children }
      <ComConLoading visible={loading} />
    </button>
  );
};

export default ComConButton;
