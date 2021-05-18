import { useCallback } from 'react';
import { useHistory } from 'react-router';

export const useSafeLink = () => {
  const history = useHistory();
  const goLink = useCallback((path: string, state?: unknown) => {
    if (history.location.pathname === path) return;
    history.push(path, state);
  }, [ history ]);
  return goLink;
};
