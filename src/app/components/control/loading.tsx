import { FC } from 'react';

import './control.scss';

const ComConLoading: FC<{ visible?: boolean }> = ({ visible }) => {
  return visible ? <div className="com-con-loading"></div> : <></>;
};

export default ComConLoading;
