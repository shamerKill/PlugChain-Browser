import { useCallback } from 'react';
import { useHistory } from 'react-router';

export const useSafeLink = () => {
  const history = useHistory();
  const goLink = useCallback((path: string, state?: unknown) => {
    if (`${history.location.pathname}${history.location.search}${history.location.hash}` === path) return;
    history.push(path, state);
  }, [ history ]);
  return goLink;
};

export const useSafeReplaceLink = () => {
  const history = useHistory();
  const goLink = useCallback((path: string, state?: unknown) => {
    if (`${history.location.pathname}${history.location.search}${history.location.hash}` === path) return;
    history.replace(path, state);
  }, [ history ]);
  return goLink;
};