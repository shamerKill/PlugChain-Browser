import { FC } from 'react';
import { Link } from 'react-router-dom';
import { formatClass } from '../../../tools';

import './control.scss';

const ComConLink: FC<{ link: string; noLink?: boolean; }> = ({ link, children, noLink }) => {
  if (noLink) return (
    <span className={formatClass(['a_link_no'])} title={children as string}>{children}</span>
  );
  if (/^http/.test(link)) {
    return <a className={formatClass(['a_link'])} target="_blank" href={link} title={children as string} rel="noreferrer">{children}</a>
  }
  return (
    <Link className={formatClass(['a_link'])} to={link} title={children as string}>{children}</Link>
  );
};

export default ComConLink;
