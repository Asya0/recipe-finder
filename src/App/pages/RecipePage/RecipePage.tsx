import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './RecipePage.module.scss';
import { BackArrowIcon, Button, ErrorMessage, Loading } from '@/components';
import { type RecipeInfoItem, RECIPE_INFO_CONFIG } from './config';
import { RecipeContent } from '@/App/pages/RecipePage/components/RecipeContent';
import { RecipeStoreProvider, useRecipeStore } from './models/context';

const RecipePageContent = observer(() => {
  const navigate = useNavigate();
  const recipeStore = useRecipeStore();
  const { recipe, loading, error } = recipeStore;

  if (loading) {
    return <Loading size="l" color="accent" />;
  }
  if (error) {
    return (
      <ErrorMessage error={error}>
        <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
      </ErrorMessage>
    );
  }
  if (!recipe) {
    return <div className={styles.recipe__notFound}>Рецепт не найден</div>;
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
});

const RecipePage = () => {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) {
    return <div className={styles.recipe__notFound}>ID рецепта не указан</div>;
  }

  return (
    <RecipeStoreProvider documentId={documentId}>
      <RecipePageContent />
    </RecipeStoreProvider>
  );
};

export default RecipePage;
