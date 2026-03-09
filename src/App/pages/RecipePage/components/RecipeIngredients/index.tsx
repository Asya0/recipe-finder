import styles from './RecipeIngredients.module.scss';
import { RecipeSectionHeader } from '../RecipeSectionHeader';
import { IngredientIcon } from '@/components';
import { Ingredient } from '@/api/recipes';
import { observer } from 'mobx-react-lite';

interface RecipeIngredientsProps {
  ingredients?: Ingredient[];
}

export const RecipeIngredients = observer(({ ingredients = [] }: RecipeIngredientsProps) => {
  if (!ingredients.length) return null;

  return (
    <div className={styles['ingredients-section']}>
      <RecipeSectionHeader title="Ingredients" />
      <div className={styles['ingredients-grid']}>
        {ingredients.map((ing) => (
          <div key={ing.id} className={styles['ingredient-item']}>
            <div className={styles['ingredient-icon']}>
              <IngredientIcon width={24} height={16} />
            </div>
            <span className={styles['ingredient-name']}>
              {ing.amount} {ing.unit} {ing.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
