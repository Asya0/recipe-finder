import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './RecipesPage.module.scss';
import banner from '@/assets/header-bg.png';
import { Pagination, Button, Loading, SearchBar, ErrorMessage } from '@/components';
import { RecipesStoreProvider, useRecipesStore } from './models/context';
import { RecipeCard, FiltersBar } from './components';
import { usePagination } from '@/hooks/usePagination';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const RecipesPageContent = observer(() => {
  const recipesStore = useRecipesStore();
  const [searchInput, setSearchInput] = useState(recipesStore.searchQuery);
  const isFirstRender = useRef(true);
  const isProgrammaticChange = useRef(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { handlePageChange } = usePagination({
    totalPages: recipesStore.totalPages,
    currentPage: recipesStore.currentPage,
    onPageChange: (page) => {
      recipesStore.setPage(page);
    },
    scrollToTop: true,
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isProgrammaticChange.current) {
      isProgrammaticChange.current = false;
      return;
    }

    if (debouncedSearch !== recipesStore.searchQuery) {
      recipesStore.setSearchQuery(debouncedSearch);
    }
  }, [debouncedSearch, recipesStore]);

  useEffect(() => {
    if (recipesStore.searchQuery !== searchInput) {
      isProgrammaticChange.current = true;
      setSearchInput(recipesStore.searchQuery);
    }
  }, [recipesStore.searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = useCallback(() => {
    recipesStore.setSearchQuery(searchInput);
  }, [recipesStore, searchInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  if (recipesStore.categoriesLoading && recipesStore.isLoading) {
    return <Loading size="l" color="accent" />;
  }

  if (recipesStore.categoriesError && recipesStore.recipes.length === 0) {
    return (
      <ErrorMessage error={recipesStore.categoriesError}>
        <Button onClick={() => recipesStore.fetchCategories()}>Повторить попытку</Button>
      </ErrorMessage>
    );
  }

  if (!recipesStore) {
    return <Loading size="l" color="accent" />;
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
          value={searchInput}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
          onKeyDown={handleKeyDown}
        />

        <FiltersBar />

        {recipesStore.isLoading ? (
          <Loading size="l" color="accent" />
        ) : recipesStore.error ? (
          <ErrorMessage error={recipesStore.error}>
            <Button onClick={() => recipesStore.fetchRecipes()}>Повторить попытку</Button>
          </ErrorMessage>
        ) : (
          <>
            {recipesStore.recipes.length > 0 && (
              <div className={styles['recipes-page__grid']}>
                {recipesStore.recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    imageUrl={recipesStore.getRecipeImageUrl(recipe)}
                  />
                ))}
              </div>
            )}

            {recipesStore.recipes.length === 0 && !recipesStore.isLoading && (
              <div className={styles['recipes-page__notFound']}>
                По вашему запросу ничего не найдено :с
              </div>
            )}
          </>
        )}

        {recipesStore.totalPages > 1 && (
          <Pagination
            currentPage={recipesStore.currentPage}
            totalPages={recipesStore.totalPages}
            onPageChange={handlePageChange}
            className={styles['recipes-page__pagination']}
          />
        )}
      </div>
    </div>
  );
});

const RecipesPage = () => {
  return (
    <RecipesStoreProvider>
      <RecipesPageContent />
    </RecipesStoreProvider>
  );
};

export default RecipesPage;
