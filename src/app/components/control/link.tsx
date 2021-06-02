import { FC } from 'react';
import { Link } from 'react-router-dom';

import './control.scss';

const ComConLink: FC<{ link: string }> = ({ link, children }) => {
  return (
    <Link className="a_link" to={link} title={children as string}>{children}</Link>
  );
};

export default ComConLink;
