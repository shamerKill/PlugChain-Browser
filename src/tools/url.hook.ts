import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { formatPath, formatSearch } from './url';

export const useFormatSearch = <T = { [key: string]: any }>() => {
  const location = useLocation();
  const [ search, setSearch ] = useState<T>();
  useEffect(() => {
    setSearch(formatSearch<T>(location.search));
  }, [ location.search ]);
  return search;
};

export const useFormatPath = () => {
  const location = useLocation();
  const [ params, setParams ] = useState<string[]>([]);
  useEffect(() => {
    setParams(formatPath(location.pathname));
  }, [ location.pathname ]);
  return params;
};