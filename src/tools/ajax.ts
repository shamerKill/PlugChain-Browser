import getEnvConfig from './env-config';
import { BehaviorSubject } from 'rxjs';
import { useRef } from 'react';

export type TypeAjaxResult<T = any> = {
  loading: boolean;
  success: boolean;
  status?: number;
  data?: T;
  message?: string;
}

type TypeQuery = { [key: string]: any };

const formatUrl = (url: string, query?: TypeQuery): string => {
  let pathName = `${getEnvConfig.BASE_URL}/${url}`.replace(/(?<!:)\/{2,}/g, '/');
  if (query !== undefined) {
    const queryStr = Object.keys(query).map(key => `${key}=${JSON.stringify(query[key])}`);
    pathName += `?${queryStr.join('&')}`;
  }
  return pathName;
};

const fetchOptions: { [key: string]: string } = {
  // credentials: 'include',
};

export const fetchData = <T = any>(type: 'GET'|'POST', url: string, query?: TypeQuery) => {
  const status: TypeAjaxResult<T> = {
    loading: true,
    success: false,
  };
  const getObservable = new BehaviorSubject(status);
  fetch(formatUrl(url, type === 'GET' ? query : undefined), {
    ...fetchOptions,
    method: type,
    body: (() => {
      // 格式化post请求数据
      if (!query) return null;
      const fm = new FormData();
      for (let key in query) fm.append(key, query[key]);
      return fm;
    })(),
  }).then(blob => {
    try {
      return blob.json();
    } catch (err) {
      blob.text().then(text => {
        getObservable.next({
          loading: false,
          success: false,
          message: text,
        });
      });
    }
  })
    .then(result => {
      getObservable.next({
        loading: false,
        success: true,
        status: result.status || 200,
        data: result.data || result.result,
        message: result.message || 'success',
      });
    })
    .catch(err => {
      getObservable.next({
        loading: false,
        success: false,
        message: err.message,
      });
    });
  return getObservable;
};

export const useAjaxGet = <T = any>(url: string, query?: TypeQuery) => {
  const memResult = useRef(fetchData<T>(
    'GET', url, query,
  ));
  return memResult.current;
};
export const useAjaxPost = <T = any>(url: string, query?: TypeQuery) => {
  const memResult = useRef(fetchData<T>(
    'POST', url, query,
  ));
  return memResult.current;
};
