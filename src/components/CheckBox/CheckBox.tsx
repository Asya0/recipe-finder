// import React from 'react';
// import cn from 'classnames';
// import CheckIcon from '@/components/icons/CheckIcon';
// import '@/CheckBox';

// export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
//   /** Вызывается при клике на чекбокс */
//   onChange: (checked: boolean) => void;
// };

// const CheckBox: React.FC<CheckBoxProps> = ({
//   className,
//   checked = false,
//   onChange,
//   disabled = false,
//   id,
//   ...inputProps
// }) => {
//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     onChange(event.target.checked);
//   };

//   const checkboxId = id;

//   const checkboxClassName = cn(
//     'checkbox',
//     {
//       'checkbox--checked': checked,
//       'checkbox--disabled': disabled,
//     },
//     className
//   );

//   return (
//     <label htmlFor={checkboxId} className={checkboxClassName}>
//       <input
//         id={checkboxId}
//         type="checkbox"
//         className="checkbox-input"
//         checked={checked}
//         onChange={handleChange}
//         disabled={disabled}
//         {...inputProps}
//       />
//       <span className="checkbox-custom">
//         {checked && <CheckIcon width={40} height={40} color={disabled ? 'secondary' : 'accent'} />}
//       </span>
//       {inputProps.children && <span className="checkbox__label">{inputProps.children}</span>}
//     </label>
//   );
// };

// export default CheckBox;

import React from 'react';
import cn from 'classnames';
import CheckIcon from '../icons/CheckIcon';
import styles from './CheckBox.module.scss';

export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  className,
  checked = false,
  onChange,
  disabled = false,
  id,
  children,
  ...inputProps
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const checkboxClassName = cn(
    styles.checkbox,
    {
      [styles['checkbox--checked']]: checked,
      [styles['checkbox--disabled']]: disabled,
    },
    className
  );

  return (
    <label htmlFor={checkboxId} className={checkboxClassName}>
      <input
        id={checkboxId}
        type="checkbox"
        className={styles['checkbox-input']}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...inputProps}
      />
      <span className={styles['checkbox-custom']}>
        {checked && <CheckIcon width={40} height={40} color={disabled ? 'secondary' : 'accent'} />}
      </span>
      {children && <span className={styles['checkbox-label']}>{children}</span>}
    </label>
  );
};

export default CheckBox;
