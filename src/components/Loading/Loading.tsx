import React from 'react';
import Loader from '../Loader';
import styles from './Loading.module.scss';

const Loading = ({ size = 'l', color = 'accent' }: React.ComponentProps<typeof Loader>) => (
  <div className={styles.loaderContainer}>
    <Loader size={size} color={color} />
  </div>
);

export default Loading;
