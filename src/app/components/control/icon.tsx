import { FC, SVGProps } from 'react';
import { formatClass } from '../../../tools';

const ComConSvg: FC<SVGProps<SVGSVGElement>> = ({
  xlinkHref,
  className
}) => {
  return (
    <svg className={formatClass(['icon', className])} aria-hidden="true">
      <use xlinkHref={xlinkHref}></use>
    </svg>
  );
};

export default ComConSvg;
