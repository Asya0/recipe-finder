import React from 'react';
import styles from './RecipeDirections.module.scss';
import { Direction  } from '@/api/recipes';

interface RecipeDirectionsProps {
  directions?: Direction[];
}

export const RecipeDirections: React.FC<RecipeDirectionsProps> = ({ directions = [] }) => {
  if (!directions.length) return null;

  return (
    <div className={styles['directions-section']}>
      <h2 className={styles['directions-title']}>Directions</h2>
      <ol className={styles['directions-list']}>
        {directions.map((step, index) => (
          <li key={step.id} className={styles['step-item']}>
            <div className={styles['step-number']}>Step {index + 1}</div>
            <p className={styles['step-description']}>{step.description}</p>
            {step.image && (
              <img
                src={step.image.url}
                alt={`Step ${index + 1}`}
                className={styles['step-image']}
                loading="lazy"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};