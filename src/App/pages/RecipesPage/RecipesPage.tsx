import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
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
import { useRootStore } from '@/hooks/useRootStore';

const RecipesPage = observer(() => {
  const { recipes } = useRootStore();
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [searchValue, setSearchValue] = useState(recipes.searchQuery);

  const categoryId = recipes.filters.categoryId;
  const category = categoryOptions.find((opt) => opt.key === categoryId);

  useEffect(() => {
    if (categoryId) {
      if (category) {
        setSelectedCategories([category]);
      }
    } else {
      setSelectedCategories([]);
    }
  }, [categoryId, category]);

  const handleSearch = () => {
    recipes.setSearchQuery(searchValue);
  };

  const handleCategoryChange = (options: Option[]) => {
    setSelectedCategories(options);
    const categoryId = options[0]?.key || null;
    recipes.setFilter('categoryId', categoryId);
  };

  const handlePageChange = (page: number) => {
    recipes.setPage(page);
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
            onChange={handleCategoryChange}
            getTitle={(values) => {
              if (values.length === 0) return 'Categories';
              if (values.length === 1) return values[0].value;
              return `Выбрано: ${values.length}`;
            }}
            className={styles['recipes-page__categoryDropdown']}
          />
        </div>

        {recipes.isLoading ? (
          <Loading size="l" color="accent" />
        ) : recipes.error ? (
          <ErrorMessage error={recipes.error}>
            <Button onClick={() => recipes.fetchRecipes()}>Повторить попытку</Button>
          </ErrorMessage>
        ) : (
          recipes.filteredRecipes.length > 0 && (
            <div className={styles['recipes-page__grid']}>
              {recipes.filteredRecipes.map((recipe) => (
                <Link
                  to={`/recipe/${recipe.documentId}`}
                  key={recipe.id}
                  className={styles['recipes-page__gridItem']}
                >
                  <Card
                    image={recipes.getRecipeImageUrl(recipe)}
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
        {recipes.filteredRecipes.length === 0 && (
          <div className={styles['recipes-page__notFound']}>
            По вашему запросу ничего не найдено :с
          </div>
        )}

        {recipes.totalPages > 1 && (
          <Pagination
            currentPage={recipes.currentPage}
            totalPages={recipes.totalPages}
            onPageChange={handlePageChange}
            className={styles['recipes-page__pagination']}
          />
        )}
      </div>
    </div>
  );
});

export default RecipesPage;
