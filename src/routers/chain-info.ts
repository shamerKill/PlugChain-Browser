import { RouteProps } from 'react-router-dom';
import PageHome from '../app/pages/home/home';
export const chainInfoPath = '';

export const chainInfoRouter: RouteProps[] = [
  {
    path: '',
    component: PageHome,
    exact: true,
  },
];
