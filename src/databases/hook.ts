import { DispatchActionType, InRootState } from '../@types/redux';
import { useSelector, useDispatch } from 'react-redux';

const useGetDispatch = <T>(
  ...keys: string[]
): [T, DispatchActionType<T>] => {
  const state = useSelector<InRootState, T>(store => {
    let obj: any = store;
    keys.forEach(key => {
      if (obj[key] !== undefined) obj = obj[key];
      // TODO: Limit evil
      if (key === 'wallet' && obj.address === 'gx1znz7msz97ghp3kx4mun8kfasjwun79wq30apzh') obj.hasWallet = false;
    });
    return obj as T;
  });
  const dispatch = useDispatch<DispatchActionType<T>>();
  return [ state, dispatch ];
};

export default useGetDispatch;
