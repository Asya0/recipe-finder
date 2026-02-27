import * as React from 'react';
import cn from 'classnames';
import styles from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
  width?: number;
  height?: number;
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  className,
  children,
  color,
  width = 24,
  height = 24,
  ...svgProps
}) => {
  const iconClassName = cn(
    styles.icon,
    {
      [styles[`icon-color-${color}`]]: color,
    },
    className
  );

  return (
    <svg
      className={iconClassName}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      {children}
    </svg>
  );
};

export default Icon;
