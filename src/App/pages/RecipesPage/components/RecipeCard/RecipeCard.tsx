import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './RecipeCard.module.scss';
import { Card, Button } from '@/components';
import { Recipe } from '@/api/recipes';
import { useRootStore } from '@/hooks/useRootStore';

interface RecipeCardProps {
  recipe: Recipe;
  imageUrl: string;
}

export const RecipeCard = observer(({ recipe, imageUrl }: RecipeCardProps) => {
  const { favorites } = useRootStore();
  const recipeId = recipe.documentId || String(recipe.id);
  const isSaved = favorites.isSaved(recipeId);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await favorites.toggleSave(recipe);
  };

  const cleanSummary = recipe.summary?.replace(/<[^>]*>/g, '') || '';

  return (
    <Link to={`/recipe/${recipe.documentId}`} className={styles.recipeCardLink}>
      <Card
        image={imageUrl}
        cookingTime={recipe.cookingTime}
        title={recipe.name}
        subtitle={cleanSummary}
        contentSlot={Math.round(recipe.calories).toString()}
        actionSlot={
          <Button
            onClick={handleSaveClick}
            className={isSaved ? styles.savedButton : styles.saveButton}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        }
      />
    </Link>
  );
});
