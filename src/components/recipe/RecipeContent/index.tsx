import styles from './RecipeContent.module.scss';
import { RecipeIngredients } from '../RecipeIngredients';
import { RecipeEquipment } from '../RecipeEquipment';
import { RecipeDirections } from '../RecipeDirections';
import { Recipe } from '@/api/recipes';

interface RecipeContentProps {
    recipe: Recipe;
  }

  export const RecipeContent: React.FC<RecipeContentProps> = ({ recipe }) => {
  return (
    <div className={styles['recipe-content']}>
      <div className={styles['recipe__ingredients-equipment']}>
        <RecipeIngredients ingredients={recipe.ingradients} />
        <div className={styles["divider-container"]}>
          <div className={styles['divider-dot']}></div>
          <div className={styles['divider']}></div>
        </div>
        <RecipeEquipment equipment={recipe.equipments} />
      </div>

      <RecipeDirections directions={recipe.directions} />
    </div>
  );
};
export default RecipeContent;