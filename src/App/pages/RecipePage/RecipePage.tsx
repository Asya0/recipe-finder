import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe } from '@/api/recipes';
import styles from './RecipePage.module.scss';
import Loader from '@/components/Loader';
import BackArrowIcon from '@/components/icons/BackArrowIcon/BackArrowIcon';
import EquipmentIcon from '@/components/icons/EquipmentIcon/EquipmentIcon';
import IngredientIcon from '@/components/icons/IngredientIcon/IngredientIcon';

const RecipePage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        const populateParams = [
          'ingradients',
          'equipments',
          'directions.image',
          'images',
          'category',
        ];

        const queryString = populateParams
          .map((param, index) => `populate[${index}]=${param}`)
          .join('&');

        const response = await fetch(
          `https://front-school-strapi.ktsdev.ru/api/recipes/${documentId}?${queryString}`
        );

        if (!response.ok) {
          throw new Error('Рецепт не найден');
        }

        const data = await response.json();
        setRecipe(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchRecipe();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className={styles.recipe__loading}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.recipe__error}>
        <h2>Ошибка!</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Вернуться назад</button>
      </div>
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
          <div className={styles['recipe__info-item']}>
            <span className={styles['recipe__info-label']}>Preparation</span>
            <span className={styles['recipe__info-value']}>{recipe.preparationTime} minutes</span>
          </div>
          <div className={styles['recipe__info-item']}>
            <span className={styles['recipe__info-label']}>Cooking</span>
            <span className={styles['recipe__info-value']}>{recipe.cookingTime} minutes</span>
          </div>
          <div className={styles['recipe__info-item']}>
            <span className={styles['recipe__info-label']}>Total</span>
            <span className={styles['recipe__info-value']}>{recipe.totalTime} minutes</span>
          </div>
          <div className={styles['recipe__info-item']}>
            <span className={styles['recipe__info-label']}>Likes</span>
            <span className={styles['recipe__info-value']}>{recipe.likes}</span>
          </div>
          <div className={styles['recipe__info-item']}>
            <span className={styles['recipe__info-label']}>Servings</span>
            <span className={styles['recipe__info-value']}>{recipe.servings} servings</span>
          </div>
          <div className={styles['recipe__info-item']}>
            <span className={styles['recipe__info-label']}>Rating</span>
            <span className={styles['recipe__info-value']}>{recipe.rating} / 5</span>
          </div>
        </div>
      </div>

      {recipe.summary && (
        <div className={styles.recipe__description}>
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>
      )}

      <div className={styles['recipe__ingredients-equipment']}>
        <div className={styles['recipe__ingredients-section']}>
          <div className={styles['recipe__section-header']}>
            <h2 className={styles['recipe__section-title']}>Ingredients</h2>
          </div>
          <div className={styles['recipe__ingredients-grid']}>
            {recipe.ingradients?.map((ing) => (
              <div key={ing.id} className={styles['recipe__ingredient-item']}>
                <div className={styles['recipe__ingredient-icon']}>
                  <IngredientIcon
                    width={24}
                    height={16}
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  />
                </div>
                <span className={styles['recipe__ingredient-name']}>
                  {ing.amount} {ing.unit} {ing.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles['recipe__divider-dot']}></div>
          <div className={styles['recipe__divider']}></div>
        </div>

        {recipe.equipments && recipe.equipments?.length > 0 && (
          <div className={styles['recipe__equipment-section']}>
            <div className={styles['recipe__section-header']}>
              <h2 className={styles['recipe__section-title']}>Equipment</h2>
            </div>
            <div className={styles['recipe__equipment-grid']}>
              {recipe.equipments.map((eq) => (
                <div key={eq.id} className={styles['recipe__equipment-item']}>
                  <div className={styles['recipe__equipment-icon']}>
                    <EquipmentIcon
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    />
                  </div>
                  <span className={styles['recipe__equipment-name']}>{eq.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {recipe.directions && recipe.directions?.length > 0 && (
        <div className={styles['recipe__directions-section']}>
          <h2 className={styles['recipe__directions-title']}>Directions</h2>
          <ol className={styles['recipe__directions-list']}>
            {recipe.directions.map((step, index) => (
              <li key={step.id} className={styles['recipe__step-item']}>
                <div className={styles['recipe__step-number']}>Step {index + 1}</div>
                <p className={styles['recipe__step-description']}>{step.description}</p>
                {step.image && (
                  <img
                    src={step.image.url}
                    alt={`Step ${index + 1}`}
                    className={styles['recipe__step-image']}
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
