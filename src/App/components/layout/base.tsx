import { FC, Fragment } from 'react';
import { formatClass } from '../../../tools';
import ComLayFooter from './footer';
import ComLayHeader from './header';

import './layout.scss';

export type TypeComponentsLayoutBase = {
  fixWidth?: boolean;
  bg?: boolean;
  className?: string;
};

const ComponentsLayoutBase: FC<TypeComponentsLayoutBase> = ({
  children,
  className,
  // TODO: page background for canvas or images.
  bg = true,
  fixWidth = true,
}) => {
  return (
    <Fragment>
      <ComLayHeader />
      <div
        className={formatClass(['layout-base', fixWidth && 'layout-base-fix', className])}>
        { children }
      </div>
      <ComLayFooter />
    </Fragment>
  );
};

export default ComponentsLayoutBase;
