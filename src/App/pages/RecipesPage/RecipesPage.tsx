import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './RecipesPage.module.scss';
import banner from '@/assets/header-bg.png';
import {
  Pagination,
  MultiDropdown,
  Button,
  Loading,
  Card,
  CheckBox,
  SearchBar,
  ErrorMessage,
  type Option,
} from '@/components';
import { useRootStore } from '@/hooks/useRootStore';
import { useCategories } from '@/hooks/useCategories';
import { usePaginationWithUrl } from '@/hooks/usePaginationWithUrl';

const RecipesPage = observer(() => {
  const { recipes, favorites } = useRootStore();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { handlePageChange } = usePaginationWithUrl({
    totalPages: recipes.totalPages,
    defaultPage: recipes.currentPage,
    onPageChange: (page) => recipes.setPage(page),
    scrollToTop: true,
  });
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [searchValue, setSearchValue] = useState(recipes.searchQuery);
  const [vegetarian, setVegetarian] = useState(recipes.filters.vegetarian === true);

  const [, setSavedStates] = useState<Record<string | number, boolean>>({});

  const categoryId = recipes.filters.categoryId;
  const category = categories.find((opt) => opt.key === categoryId);

  useEffect(() => {
    if (categoryId && category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryId, category]);

  useEffect(() => {
    setVegetarian(recipes.filters.vegetarian === true);
  }, [recipes.filters.vegetarian]);

  useEffect(() => {
    const initialStates: Record<string | number, boolean> = {};
    recipes.filteredRecipes.forEach(recipe => {
      initialStates[recipe.id] = favorites.isSaved(recipe.id);
    });
    setSavedStates(initialStates);
  }, [recipes.filteredRecipes, favorites]);
  

  const handleSearch = () => {
    recipes.setSearchQuery(searchValue);
    recipes.setPage(1);
    updateUrlWithFilters(
      searchValue, 
      recipes.filters.categoryId, 
      recipes.filters.vegetarian === true,
      1
    );
  };

  const handleCategoryChange = (options: Option[]) => {
    const lastSelected = options.length > 0 ? [options[options.length - 1]] : [];

    setSelectedCategories(lastSelected);
    const categoryId = lastSelected[0]?.key || null;
    recipes.setFilter('categoryId', categoryId);
    recipes.setPage(1);

    updateUrlWithFilters(
      recipes.searchQuery,
      categoryId,
      recipes.filters.vegetarian === true,
      1
    );
  };
  const handleVegetarianChange = (checked: boolean) => {
    setVegetarian(checked);
    recipes.setFilter('vegetarian', checked);
    recipes.setPage(1);

    updateUrlWithFilters(
      recipes.searchQuery,
      recipes.filters.categoryId,
      checked,
      1
    );
  };

  const handleSaveClick = (e: React.MouseEvent, recipe: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedStates(prev => ({
      ...prev,
      [recipe.id]: !prev[recipe.id]
    }));
    favorites.toggleSave(recipe);
  };

  const updateUrlWithFilters = (search: string,  categoryId: string | null | undefined, vegetarian: boolean, page: number) => {
    const params = new URLSearchParams(location.search);
    
    if (search) params.set('search', search);
    else params.delete('search');
    
    if (categoryId) params.set('category', categoryId);
    else params.delete('category');
    
    if (vegetarian) params.set('vegetarian', 'true');
    else params.delete('vegetarian');

    if (page > 1) params.set('page', page.toString());
    
    navigate({ search: params.toString() }, { replace: true });
  };

  if (categoriesLoading) {
    return <Loading size="l" color="accent" />;
  }

  if (categoriesError) {
    return (
      <ErrorMessage error={categoriesError}>
        <Button onClick={() => window.location.reload()}>Повторить попытку</Button>
      </ErrorMessage>
    );
  }

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

        <div className={styles['recipes-page__filtersRow']}>
          <div className={styles['recipes-page__vegetarianRow']}>
            <CheckBox
              checked={vegetarian}
              onChange={handleVegetarianChange}
              disabled={recipes.isLoading}
              className={styles['recipes-page__checkbox']}
            ></CheckBox>
            Vegetarian
          </div>

          <div className={styles['recipes-page__categoryRow']}>
            <MultiDropdown
              options={categories}
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
              {recipes.filteredRecipes.map((recipe) => {
                const isSaved = favorites.isSaved(recipe.id);

                return (
                  <Link
                    to={`/recipe/${recipe.documentId}`}
                    key={recipe.id}
                    className={styles.recipeCardLink}
                  >
                    <Card
                      image={recipes.getRecipeImageUrl(recipe)}
                      cookingTime={recipe.cookingTime}
                      title={recipe.name}
                      subtitle={recipe.summary}
                      contentSlot={Math.round(recipe.calories).toString()}
                      actionSlot={
                        <Button
                          onClick={(e) => handleSaveClick(e, recipe)}
                          className={isSaved ? styles.savedButton : styles.saveButton}
                        >
                          {isSaved ? 'Saved' : 'Save'}
                        </Button>
                      }
                    />
                  </Link>
                );
              })}
            </div>
          )
        )}
        {recipes.filteredRecipes.length === 0 && !recipes.isLoading && (
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
