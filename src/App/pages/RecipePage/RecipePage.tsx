import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe } from '@/api/recipes';
import styles from './RecipePage.module.scss';
import Loader from '@/components/Loader';
import Icon from '@/components/icons/Icon';

const BackArrowIcon = () => (
  <Icon width={32} height={32}>
    <path
      d="M20.1201 26.56L11.4268 17.8667C10.4001 16.84 10.4001 15.16 11.4268 14.1333L20.1201 5.44"
      stroke="#B5460F"
      stroke-width="2"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Icon>
);

const IngredientIcon = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.1605 13.0805C23.0466 10.2707 21.8991 7.64537 19.8988 5.64512C18.5148 4.26109 16.8316 3.28501 14.995 2.77716C14.8783 1.22639 13.5801 0 12 0C10.4199 0 9.12175 1.22635 9.00503 2.77716C7.16847 3.28501 5.48523 4.26109 4.10124 5.64512C2.10094 7.64533 0.953486 10.2707 0.839533 13.0805C0.364126 13.1591 0 13.5719 0 14.0692V14.7795C0 15.3327 0.450142 15.7829 1.00336 15.7829H22.9966C23.5499 15.7829 24 15.3327 24 14.7795V14.0692C24 13.5719 23.6359 13.1591 23.1605 13.0805ZM12 0.956205C12.9736 0.956205 13.79 1.63913 13.997 2.55085C13.3445 2.43371 12.6769 2.37329 12 2.37329C11.3231 2.37329 10.6555 2.43371 10.003 2.55085C10.21 1.63913 11.0265 0.956205 12 0.956205ZM12 3.32949C17.4721 3.32949 21.953 7.65461 22.2034 13.0659H1.79663C2.04704 7.65461 6.52792 3.32949 12 3.32949ZM23.0439 14.7795C23.0439 14.8055 23.0227 14.8267 22.9967 14.8267H1.00336C0.977346 14.8267 0.956158 14.8055 0.956158 14.7795V14.0692C0.956158 14.0432 0.977346 14.022 1.00336 14.022H22.9967C23.0227 14.022 23.0439 14.0432 23.0439 14.0692V14.7795Z"
      fill="#B5460F"
    />
  </svg>
);

const EquipmentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.94982 1.67442C3.14086 1.67442 1.67442 3.14086 1.67442 4.94982C1.67442 5.41219 1.29958 5.78702 0.837209 5.78702C0.374835 5.78702 0 5.41219 0 4.94982C0 2.2161 2.2161 0 4.94982 0C7.68353 0 9.89963 2.2161 9.89963 4.94982V12.6657C10.3089 12.422 10.7776 12.2108 11.2725 12.0306C12.7604 11.4892 14.6721 11.1628 16.4651 11.1628C18.2598 11.1628 20.0432 11.4899 21.4063 12.0413C22.0855 12.316 22.7023 12.6634 23.1637 13.0894C23.6229 13.5135 24 14.0872 24 14.7907V16.1126C24 20.4687 20.4687 24 16.1126 24C11.7565 24 8.22521 20.4687 8.22521 16.1126V4.94982C8.22521 3.14086 6.75877 1.67442 4.94982 1.67442ZM22.2402 17.1452C21.7485 20.085 19.1922 22.3256 16.1126 22.3256C12.9647 22.3256 10.3636 19.9845 9.95537 16.9484C10.3513 17.1784 10.7998 17.3788 11.2725 17.5508C12.7604 18.0922 14.6721 18.4186 16.4651 18.4186C18.2598 18.4186 20.0432 18.0916 21.4063 17.5401C21.6982 17.422 21.9786 17.2905 22.2402 17.1452ZM22.3256 14.7907C22.3256 14.7235 22.2915 14.5632 22.0278 14.3195C21.7659 14.0777 21.3475 13.8238 20.7783 13.5935C19.6448 13.1349 18.0795 12.8372 16.4651 12.8372C14.8491 12.8372 13.1329 13.1355 11.8451 13.6041C11.198 13.8396 10.7044 14.1018 10.3893 14.356C10.0594 14.6221 10.0465 14.7747 10.0465 14.7907C10.0465 14.8067 10.0594 14.9593 10.3893 15.2254C10.7044 15.4796 11.198 15.7418 11.8452 15.9773C13.1329 16.4459 14.8491 16.7442 16.4651 16.7442C18.0795 16.7442 19.6448 16.4466 20.7783 15.9879C21.3475 15.7577 21.7659 15.5037 22.0278 15.2619C22.2915 15.0182 22.3256 14.8579 22.3256 14.7907Z"
      fill="#B5460F"
    />
  </svg>
);

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
      <div className={styles.recipeLoading}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.recipeError}>
        <h2>Ошибка!</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Вернуться назад</button>
      </div>
    );
  }

  if (!recipe) {
    return <div className={styles.recipePage}>Рецепт не найден</div>;
  }

  return (
    <div className={styles.recipePage}>
      <div className={styles.breadcrumbs}>
        <div className={styles.backArrow} onClick={() => navigate(-1)}>
          <BackArrowIcon />
        </div>
        <h1 className={styles.recipeTitle}>{recipe.name}</h1>
      </div>

      <div className={styles.recipeMain}>
        {recipe.images?.[0] && (
          <img
            src={recipe.images[0].formats?.small?.url}
            alt={recipe.name}
            className={styles.recipeImage}
          />
        )}

        <div className={styles.recipeInfoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Preparation</span>
            <span className={styles.infoValue}>{recipe.preparationTime} minutes</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Cooking</span>
            <span className={styles.infoValue}>{recipe.cookingTime} minutes</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Total</span>
            <span className={styles.infoValue}>{recipe.totalTime} minutes</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Likes</span>
            <span className={styles.infoValue}>{recipe.likes}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Servings</span>
            <span className={styles.infoValue}>{recipe.servings} servings</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Rating</span>
            <span className={styles.infoValue}>{recipe.rating} / 5</span>
          </div>
        </div>
      </div>

      {recipe.summary && (
        <div className={styles.recipeDescription}>
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        </div>
      )}

      <div className={styles.ingredientsEquipment}>
        <div className={styles.ingredientsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
          </div>
          <div className={styles.ingredientsGrid}>
            {recipe.ingradients?.map((ing) => (
              <div key={ing.id} className={styles.ingredientItem}>
                <div className={styles.ingredientIcon}>
                  <IngredientIcon />
                </div>
                <span className={styles.ingredientName}>
                  {ing.amount} {ing.unit} {ing.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles['divider-dot']}></div>
          <div className={styles.divider}></div>
        </div>

        {recipe.equipments && recipe.equipments?.length > 0 && (
          <div className={styles.equipmentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Equipment</h2>
            </div>
            <div className={styles.equipmentGrid}>
              {recipe.equipments.map((eq) => (
                <div key={eq.id} className={styles.equipmentItem}>
                  <div className={styles.equipmentIcon}>
                    <EquipmentIcon />
                  </div>
                  <span className={styles.equipmentName}>{eq.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {recipe.directions && recipe.directions?.length > 0 && (
        <div className={styles.directionsSection}>
          <h2 className={styles.directionsTitle}>Directions</h2>
          <ol className={styles.directionsList}>
            {recipe.directions.map((step, index) => (
              <li key={step.id} className={styles.stepItem}>
                <div className={styles.stepNumber}>Step {index + 1}</div>
                <p className={styles.stepDescription}>{step.description}</p>
                {step.image && (
                  <img
                    src={step.image.url}
                    alt={`Step ${index + 1}`}
                    className={styles.stepImage}
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
