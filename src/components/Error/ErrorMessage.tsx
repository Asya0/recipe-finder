import React from 'react';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  error: string;
  children?: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, children }) => (
  <div className={styles['error-container']}>
    <p>{error}</p>
    {children}
  </div>
);

export default ErrorMessage;
