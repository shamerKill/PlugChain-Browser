import { FC, Fragment } from 'react';
import { formatClass } from '../../../tools';
import ComLayFooter from './footer';
import ComLayHeader from './header';
import './layout.scss';

const ComponentsLayoutBase: FC = ({
  children,
}) => {
  return (
    <Fragment>
      <ComLayHeader />
      <div className={formatClass(['layout-base'])}>
        { children }
      </div>
      <ComLayFooter />
    </Fragment>
  );
};

export default ComponentsLayoutBase;
