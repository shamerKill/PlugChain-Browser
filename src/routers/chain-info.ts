import { RouteProps } from 'react-router-dom';
import PageChainNetwork from '../app/pages/chain/network/network';
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
    component: PageChainNetwork,
  },
];
