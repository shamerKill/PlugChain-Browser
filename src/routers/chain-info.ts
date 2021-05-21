import loadable from '@loadable/component';
import { RouteProps } from 'react-router-dom';
import PageHome from '../app/pages/home/home';
export const chainInfoPath = '';

export const chainInfoRouter: RouteProps[] = [
  {
    path: '',
    component: PageHome,
    exact: true,
  },
  {
    path: 'network',
    component: loadable(() => import('../app/pages/chain/network/network')),
  },
  {
    path: 'blocks-list',
    component: loadable(() => import('../app/pages/chain/block/blocks-list')),
  },
  {
    path: 'block/:id',
    component: loadable(() => import('../app/pages/chain/block/block')),
  },
  {
    path: 'transaction-list',
    component: loadable(() => import('../app/pages/chain/transaction/transaction-list')),
  },
  {
    path: 'transaction/:id',
    component: loadable(() => import('../app/pages/chain/transaction/transaction')),
  },
];
