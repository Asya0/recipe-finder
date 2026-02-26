import { useParams, useNavigate } from 'react-router-dom';
import styles from './RecipePage.module.scss';
import { Button, ErrorMessage, Loading } from '@/components';
import { BackArrowIcon} from '@/components';
import { type RecipeInfoItem, RECIPE_INFO_CONFIG } from './config';
import { RecipeContent } from '@/components/recipe/RecipeContent';
import { useRecipe } from '@/hooks/useRecipe';

const RecipePage = () => {
  const navigate = useNavigate();


  const { documentId } = useParams<{ documentId: string }>();
  const { recipe, loading, error } = useRecipe(documentId);

  {
    loading && <Loading  size="l" color="accent" />;
  }
  {
    error && (
      <ErrorMessage error={error}>
        <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
      </ErrorMessage>
    );
  }

  if (!recipe) {
    return <div className={styles.recipe}>Рецепт не найден</div>;
  }
    
  return (
    <div className={styles.recipe}>
      <div className={styles.recipe__breadcrumbs}>
        <div className={styles['recipe__back-arrow']} onClick={() => navigate(-1)}>
          <BackArrowIcon width={24} height={32} strokeWidth={2} />
        </div>
        <h1 className={styles.recipe__title}>{recipe.name}</h1>
      </div>

      <div className={styles.recipe__main}>
        {recipe.images?.[0] && (
          <img
            src={recipe.images[0].formats?.small?.url}
            alt={recipe.name}
            className={styles.recipe__image}
          />
        )}

        <div className={styles['recipe__info-grid']}>
          {RECIPE_INFO_CONFIG.map(({ id, label, getValue }: RecipeInfoItem) => (
            <div key={id} className={styles['recipe__info-item']}>
              <span className={styles['recipe__info-label']}>{label}</span>
              <span className={styles['recipe__info-value']}>{getValue(recipe)}</span>
            </div>
          ))}
        </div>
      </div>

      {recipe.summary && (
        <div className={styles.recipe__description}>
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>
      )}

      <RecipeContent recipe={recipe} />
    </div>
  );
};

export default RecipePage;
