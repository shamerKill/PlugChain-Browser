import loadable from '@loadable/component';
import { RouteProps } from 'react-router-dom';
export const walletsPath = 'wallet';

export const walletsRouter: RouteProps[] = [
  {
    path: 'create',
    component: loadable(() => import('../app/pages/wallet/create')),
  },
];
