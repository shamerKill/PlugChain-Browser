import { getGlobalOne } from './../tools/only-id';
import { RouteProps } from 'react-router-dom';
import { InRouteConfig } from './../@types/app.system.d';
import { chainInfoRouter, chainInfoPath } from './chain-info';
import { walletsRouter, walletsPath } from './wallets';

const routeTools = (routeArr: RouteProps[], prev: string): InRouteConfig[] => routeArr.map(route => ({
  ...route,
  path: `${prev}/${route.path}`,
  key: `${prev}-${route.path}-${getGlobalOne()}`,
}));

const RoutersRoot: InRouteConfig[] = [
  ...routeTools(chainInfoRouter, chainInfoPath),
  ...routeTools(walletsRouter, walletsPath),
];

export default RoutersRoot;