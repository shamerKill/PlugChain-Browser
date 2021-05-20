import { FC } from 'react';
import { formatClass } from '../../../tools';
import ComLayFooter from './footer';
import ComLayHeader from './header';

import './layout.scss';

export type TypeComponentsLayoutBase = {
  fixWidth?: boolean;
  bg?: boolean;
  className?: string;
  headerBg?: boolean;
};

const ComponentsLayoutBase: FC<TypeComponentsLayoutBase> = ({
  children,
  className,
  // TODO: page background for canvas or images.
  bg = true,
  fixWidth = true,
  headerBg = false,
}) => {
  return (
    <>
      <ComLayHeader headerBg={headerBg} />
      <div
        className={formatClass(['layout-base', fixWidth && 'layout-base-fix', className])}>
        { children }
      </div>
      { bg && <img className="layout-bg" alt="bg" src={require('../../../assets/images/page_bg.png')} /> }
      <ComLayFooter />
    </>
  );
};

export default ComponentsLayoutBase;
