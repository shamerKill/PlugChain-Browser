import loadable from '@loadable/component';
import { RouteProps } from 'react-router-dom';
export const chainInfoPath = '';

export const chainInfoRouter: RouteProps[] = [
  {
    path: '',
    component: loadable(() => import('../app/pages/home/home')),
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
  {
    path: 'account/:address?',
    component: loadable(() => import('../app/pages/chain/account/account')),
  },
  {
    path: 'nodes/node-apply',
    component: loadable(() => import('../app/pages/chain/nodes/node-apply')),
  },
];
