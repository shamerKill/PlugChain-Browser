import { FC } from 'react';
import { formatClass } from '../../../tools';

import './control.scss';

export type TypeComponentsControlLogo = {
  link: string;
  src: string;
  target?: string;
  className?: string;
  alt?: string;
};

const ComConLogo: FC<TypeComponentsControlLogo> = ({ link, src, className, alt, target }) => {
  return (
    <div className={formatClass(['control-logo', className])}>
      <a
        target={target || '_self'}
        href={link}
        className={formatClass(['control-logo-link'])}>
        { alt }
      </a>
      <img className="control-logo-img" src={src} alt={alt} />
    </div>
  );
};

export default ComConLogo;
