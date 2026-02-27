// страница со списком
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RecipesPage.module.scss';
import banner from '@/assets/header-bg.png';
import {
  Pagination,
  MultiDropdown,
  Button,
  Loading,
  Card,
  ErrorMessage,
  type Option,
} from '@/components';
import { categoryOptions } from './config';
import SearchBar from '@/components/SearchBar/SearchBar';
import { useRecipes } from '@/hooks/useRecipes';

const RecipesPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const { error, recipes, loading, currentPage, totalPages, goToPage } = useRecipes();

  const handleSearch = () => {
    // TODO: реализовать поиск
  };

  return (
    <div className={styles['recipes-page']}>
      <div className={styles['recipes-page__banner']}>
        <img src={banner} alt="recipes" className={styles['recipes-page__bannerImage']} />
      </div>

      <div className={styles['recipes-page__infoContainer']}>
        <span className={styles['recipes-page__info']}>
          Find the perfect food and{' '}
          <span className={styles['recipes-page__infoUnderlined']}>drink ideas</span> for every
          occasion, from{' '}
          <span className={styles['recipes-page__infoUnderlined']}>weeknight dinners</span> to
          <span className={styles['recipes-page__infoUnderlined']}> holiday feasts</span>.
        </span>
      </div>

      <div className={styles['recipes-page__content']}>
        <SearchBar
          placeholder="Enter dishes"
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
          onSearch={handleSearch}
        />

        <div className={styles['recipes-page__categoryRow']}>
          <MultiDropdown
            options={categoryOptions}
            value={selectedCategories}
            onChange={setSelectedCategories}
            getTitle={(values) => {
              if (values.length === 0) return 'Categories';
              if (values.length === 1) return values[0].value;
              return `Выбрано: ${values.length}`;
            }}
            className={styles['recipes-page__categoryDropdown']}
          />
        </div>

        {loading ? (
          <Loading size="l" color="accent" />
        ) : error ? (
          <ErrorMessage error={error}>
            <Button onClick={() => goToPage(currentPage)}>Повторить попытку</Button>
          </ErrorMessage>
        ) : (
          recipes.length > 0 && (
            <div className={styles['recipes-page__grid']}>
              {recipes.map((recipe) => (
                <Link
                  to={`/recipe/${recipe.documentId}`}
                  key={recipe.id}
                  className={styles['recipes-page__gridItem']}
                >
                  <Card
                    image={recipe.images?.[0]?.url}
                    title={recipe.name}
                    subtitle={recipe.summary}
                    cookingTime={recipe.cookingTime}
                    actionSlot={<Button>Save</Button>}
                    contentSlot={recipe.calories}
                  />
                </Link>
              ))}
            </div>
          )
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          className={styles['recipes-page__pagination']}
        />
      </div>
    </div>
  );
};

export default RecipesPage;
