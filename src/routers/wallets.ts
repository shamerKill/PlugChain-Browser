import loadable from '@loadable/component';
import { RouteProps } from 'react-router-dom';
export const walletsPath = 'wallet';

export const walletsRouter: RouteProps[] = [
  {
    path: 'create',
    component: loadable(() => import('../app/pages/wallet/create/create')),
  },
  {
    path: 'create-backup',
    component: loadable(() => import('../app/pages/wallet/create/create-backup')),
  },
  {
    path: 'login',
    component: loadable(() => import('../app/pages/wallet/login/login')),
  },
  {
    path: 'account',
    component: loadable(() => import('../app/pages/wallet/account/account')),
  },
  {
    path: 'transaction',
    component: loadable(() => import('../app/pages/wallet/transaction/transaction')),
  },
  {
    path: 'reset',
    component: loadable(() => import('../app/pages/wallet/reset/reset')),
  },
  {
    path: 'receive',
    component: loadable(() => import('../app/pages/wallet/receive/receive')),
  },
];
