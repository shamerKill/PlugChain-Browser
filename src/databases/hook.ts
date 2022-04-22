import { DispatchActionType, InRootState } from '../@types/redux';
import { useSelector, useDispatch } from 'react-redux';

const useGetDispatch = <T>(
  ...keys: string[]
): [T, DispatchActionType<T>] => {
  const state = useSelector<InRootState, T>(store => {
    let obj: any = store;
    keys.forEach(key => {
      if (obj[key] !== undefined) obj = obj[key];
    });
    return obj as T;
  });
  const dispatch = useDispatch<DispatchActionType<T>>();
  return [ state, dispatch ];
};

export default useGetDispatch;
