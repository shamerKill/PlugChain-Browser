import { FC, Fragment } from 'react';
import { formatClass } from '../../../tools';
import ComponentsLayoutFooter from './footer';
import ComponentsLayoutHeader from './header';
import './layout.scss';

const ComponentsLayoutBase: FC = ({
  children,
}) => {
  return (
    <Fragment>
      <ComponentsLayoutHeader />
      <div className={formatClass(['layout-base'])}>
        { children }
      </div>
      <ComponentsLayoutFooter />
    </Fragment>
  );
};

export default ComponentsLayoutBase;
