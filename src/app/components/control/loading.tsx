import { FC, useEffect, useState } from 'react';
import { Subscription, timer } from 'rxjs';
import { formatClass } from '../../../tools';

import './control.scss';

const ComConLoading: FC<{ visible?: boolean }> = ({ visible }) => {
  const [visibleValue, setVisibleValue] = useState(false);
  useEffect(() => {
    let sub: Subscription;
    if (visible !== undefined) {
      sub = timer(100).subscribe(() => setVisibleValue(visible));
    }
    return () => sub?.unsubscribe();
  }, [visible]);
  return <div className={formatClass([visibleValue && 'com-con-loading'])}></div>;
};

export default ComConLoading;
