import { fetchData, TypeAjaxResult } from './../tools/ajax';
import { formatClass } from './../tools/className';
import { getEnvConfig, getOnlyId, verifyOnlyId, delOnlyId, copyObject, randomString } from '../tools';
import { timer } from 'rxjs';

describe('tools test', () => {
  it('onlyId', () => {
    const onlyId = getOnlyId();
    expect(verifyOnlyId(onlyId)).toBeTruthy();
    delOnlyId(onlyId);
    expect(verifyOnlyId(onlyId)).toBeFalsy();
  });
  it('copyDeep', () => {
    const obj = {
      name: 'ant',
      books: [
        { name: 'wiw' },
      ],
      read: () => 'ok',
    };
    const cloneObj = copyObject(obj);
    expect(cloneObj.name === obj.name).toBeTruthy();
    expect(cloneObj.books.length).toBe(1);
    expect(cloneObj.books[0].name === obj.books[0].name).toBeTruthy();
    expect(cloneObj.books[0] === obj.books[0]).toBeFalsy();
    expect(cloneObj.read() === 'ok').toBeTruthy();
  });
  it('env-config', () => {
    expect(getEnvConfig.TEST).toBeTruthy();
    expect(getEnvConfig.PRODUCTION).toBeFalsy();
    expect(getEnvConfig.DEVELOPMENT).toBeFalsy();
  });
  it('randomString', () => {
    const randomStr = randomString();
    expect(typeof randomStr).toBe('string');
    expect(randomStr.length).toBe(16);
    expect(randomStr).not.toMatch(/\s/g);
  });
  it('className', () => {
    const classNamesArr = [ '1', undefined, '3' ];
    const twoClassNamesArr: (string|false)[] = [ '1', '', false ];
    expect(formatClass(classNamesArr)).toBe('1 3');
    expect(formatClass(twoClassNamesArr)).toBe('1 ');
  });
  it('ajax-get', async () => {
    await import('../mocks');
    const demoObserver = fetchData('GET', '/api/demo');
    let data: TypeAjaxResult;
    demoObserver.subscribe(result => data = result);
    timer(1000).subscribe(() => {
      expect(data.loading).toBeTruthy();
      expect(data.success).toBeTruthy();
      expect(data.status).toBe(200);
      expect(data.data).toEqual({ hello: 'world' });
      expect(data.message).toBe('ok');
    });
  });
});