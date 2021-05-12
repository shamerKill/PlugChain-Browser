import { FC, HTMLAttributes, ReactElement } from 'react';
import { formatClass } from '../../../tools';

export type TypeComponentsControlSelector = {
  select: number;
  options: (string|ReactElement)[];
  onChange?: (select: number) => unknown;
};

const ComConSelector: FC<TypeComponentsControlSelector & HTMLAttributes<HTMLDivElement>> = ({
  className,
  select,
  options,
  onChange,
}) => {
  return (
    <div className={formatClass(['control-select', className])}>
      <div className={formatClass(['control-select-select'])}>
        { options[select] }
      </div>
      <select style={{ position: 'fixed', top: '-100%', left: '-100%'}}>
        <option value="1">1</option>
        <option selected value="2">你好</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <div className={formatClass(['control-select-options'])}>
        {
          options.map(item => (
            <div className={formatClass(['control-select-option'])}>
              { item }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ComConSelector;
