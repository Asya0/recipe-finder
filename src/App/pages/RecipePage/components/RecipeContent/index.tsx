import styles from './RecipeContent.module.scss';
import { RecipeIngredients } from '../RecipeIngredients';
import { RecipeEquipment } from '../RecipeEquipment';
import { RecipeDirections } from '../RecipeDirections';
import { Recipe } from '@/api/recipes';
import { observer } from 'mobx-react-lite';

interface RecipeContentProps {
  recipe: Recipe;
}

export const RecipeContent = observer(({ recipe }: RecipeContentProps) => {
  return (
    <div className={styles['recipe-content']}>
      <div className={styles['recipe__ingredients-equipment']}>
        <RecipeIngredients ingredients={recipe.ingradients} />
        <div className={styles['divider-container']}>
          <div className={styles['divider-dot']}></div>
          <div className={styles['divider']}></div>
        </div>
        <RecipeEquipment equipment={recipe.equipments} />
      </div>

      <RecipeDirections directions={recipe.directions} />
    </div>
  );
});
