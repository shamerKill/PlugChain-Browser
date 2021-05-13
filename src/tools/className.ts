export const formatClass = (classNames: (string|false|undefined)[]): string => {
  let result = '';
  result = classNames.filter(item => typeof item === 'string').join(' ');
  return result;
};
