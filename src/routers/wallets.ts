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
  {
    path: 'pledge',
    component: loadable(() => import('../app/pages/wallet/pledge/pledge')),
  },
  {
    path: 'transaction-pledge',
    component: loadable(() => import('../app/pages/wallet/transaction-pledge/transaction-pledge')),
  },
  {
    path: 'my-pledge',
    component: loadable(() => import('../app/pages/wallet/my-pledge/my-pledge')),
  },
  {
    path: 'info-pledge',
    component: loadable(() => import('../app/pages/wallet/info-pledge/info-pledge')),
  },
  {
    path: 'transfer-pledge',
    component: loadable(() => import('../app/pages/wallet/transfer-pledge/transfer-pledge')),
  },
];
