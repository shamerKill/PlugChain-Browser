export const formatSearch = <T = { [key: string]: any }>(search: string): T => {
  let searchObj: T = {} as T;
  search.replace(/(?:[?&]+)([^&]+)=([^&]+)/g, (
    __,key,value,
  ) => {
    // eslint-disable-next-line no-extra-parens
    (searchObj as unknown as any)[key] = value;
    return '';
  });
  return searchObj;
};

export const justifySearch = (obj: {[key: string]: any}, prev = ''): string => {
  let search = prev;
  search += Object.keys(obj).map(key => `${key}=${typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key]}`).join('&');
  return search;
};

export const formatPath = (path: string): string[] => path.split('/').filter(item => item !== '');
