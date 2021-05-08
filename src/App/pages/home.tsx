import { FC, useState } from 'react';
import { useAjaxGet } from '../../tools';

const PageHome: FC = () => {
  const result = useAjaxGet('/api/demo');
  result?.subscribe(data => {
    console.log(data);
  });
  const [count, setCount] = useState(1);

  return (
    <>
      <button onClick={() => setCount(state => state - 1)}>cut</button>
      <div>{count}</div>
      <button onClick={() => setCount(state => state + 1)}>add</button>
    </>
  );
};

export default PageHome;
