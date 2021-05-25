import { FC, ButtonHTMLAttributes } from 'react';
import { formatClass } from '../../../tools';

import './control.scss';
import ComConLoading from './loading';

export type TypeComponentsControlButton = {
  loading?: boolean;
  contrast?: boolean;
};

const ComConButton: FC<TypeComponentsControlButton & ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  onClick,
  className,
  loading,
  contrast,
}) => {
  return (
    <button
      className={formatClass(['control-button', contrast && 'control-button-contrast', loading && 'control-button-disabled', className])}
      onClick={onClick}
      disabled={loading}>
      { children }
      <ComConLoading visible={loading} />
    </button>
  );
};

export default ComConButton;
