import { RouteProps } from 'react-router-dom';
import routeRoot from '../routers';

describe('test routers', () => {
  it('routeKeyOnly', () => {
    const keyArr: string[] = [];
    const pathArr: RouteProps['path'][] = [];
    routeRoot.forEach(route => {
      expect(route.component).not.toBeUndefined();
      expect(route.path).not.toBeUndefined();
      expect(pathArr.includes(route.path)).toBeFalsy();
      expect(route.key).not.toBeUndefined();
      expect(keyArr.includes(route.key)).toBeFalsy();
      pathArr.push(route.path);
      keyArr.push(route.key);
    });
  });
});
