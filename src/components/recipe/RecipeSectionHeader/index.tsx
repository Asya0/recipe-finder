import React from 'react';
import styles from './RecipeSectionHeader.module.scss';

interface RecipeSectionHeaderProps {
  title: string;
}

export const RecipeSectionHeader: React.FC<RecipeSectionHeaderProps>  = ({ title }) => {
  return (
    <div className={styles['section-header']}>
      <h2 className={styles['section-title']}>{title}</h2>
    </div>
  );
};