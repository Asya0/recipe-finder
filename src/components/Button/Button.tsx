// import React from 'react';
// import cn from 'classnames';
// import Loader from '../Loader';
// import './Button';

// export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
//   loading?: boolean;
//   children: React.ReactNode;
// };

// const Button: React.FC<ButtonProps> = ({
//   className,
//   loading = false,
//   disabled = false,
//   children,
//   ...buttonProps
// }) => {
//   const buttonClassName = cn(
//     'button',
//     {
//       'button--loading': loading,
//       'button--disabled': disabled,
//     },
//     className
//   );

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     if (loading || disabled) {
//       event.preventDefault();
//       event.stopPropagation();
//       return;
//     }
//     buttonProps.onClick?.(event);
//   };

//   return (
//     <button
//       className={buttonClassName}
//       disabled={disabled || loading}
//       onClick={handleClick}
//       {...buttonProps}
//     >
//       {loading && <Loader size="s" color="white" />}
//       {children}
//     </button>
//   );
// };

// export default Button;

import React from 'react';
import cn from 'classnames';
import Loader from '../Loader';
import styles from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  className,
  loading = false,
  disabled = false,
  children,
  ...buttonProps
}) => {
  const buttonClassName = cn(
    styles.button,
    {
      [styles['button--loading']]: loading,
      [styles['button--disabled']]: disabled,
    },
    className
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    buttonProps.onClick?.(event);
  };

  return (
    <button
      className={buttonClassName}
      disabled={disabled || loading}
      onClick={handleClick}
      {...buttonProps}
    >
      {loading && <Loader size="s" color="white" />}
      {children}
    </button>
  );
};

export default Button;
