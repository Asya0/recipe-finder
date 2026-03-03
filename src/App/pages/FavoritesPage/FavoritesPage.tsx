import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './FavoritesPage.module.scss';
import { Button, Loading, Card, ErrorMessage, Pagination } from '@/components';
import { useRootStore } from '@/hooks/useRootStore';
import { Recipe } from '@/api/recipes';
import { usePaginationWithUrl } from '@/hooks/usePaginationWithUrl';

const PAGE_SIZE = 9;


const FavoritesPage = observer(() => {
  const { favorites } = useRootStore();
  
  const totalPages = Math.ceil(favorites.savedCount / PAGE_SIZE);

  const { currentPage, handlePageChange } = usePaginationWithUrl({
    totalPages,
    defaultPage: 1,
    scrollToTop: true,
  });
  
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentRecipes = favorites.savedRecipes.slice(startIndex, endIndex);

  useEffect(() => {
    favorites.loadFromStorage();
  }, []);


  const handleRemove = (recipe: Recipe, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const oldTotalPages = Math.ceil(favorites.savedCount / PAGE_SIZE);
    const isLastItemOnPage = currentRecipes.length === 1 && currentPage === oldTotalPages;
    
    favorites.removeRecipe(recipe.id);
    
    setTimeout(() => {
      const newTotalPages = Math.ceil(favorites.savedCount / PAGE_SIZE);
      
      if (isLastItemOnPage && currentPage > newTotalPages && newTotalPages > 0) {
        handlePageChange(newTotalPages);
      } else if (favorites.savedCount === 0) {
        handlePageChange(1);
      }
    }, 0);
  };

  if (favorites.isLoading) {
    return (
      <div className={styles.contentContainer}>
        <Loading size="l" color="accent" />
      </div>
    );
  }

  if (favorites.error) {
    return (
      <div className={styles.contentContainer}>
        <ErrorMessage error={favorites.error}>
          <Button onClick={() => favorites.loadFromStorage()}>Повторить попытку</Button>
        </ErrorMessage>
      </div>
    );
  }



  return (
    <div className={styles.favoritesPage}>
      <div className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>Сохраненные рецепты ({favorites.savedCount})</h1>

        {favorites.savedCount === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>У вас пока нет сохраненных рецептов</h2>
            <p className={styles.emptyText}>
              Сохраняйте понравившиеся рецепты, чтобы быстро находить их потом
            </p>
            <Link to="/recipes">
              <Button className={styles.exploreButton}>Найти рецепты</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.recipeGrid}>
              {currentRecipes.map((recipe: Recipe) => (
                <Link
                  to={`/recipe/${recipe.documentId}`}
                  key={recipe.id}
                  className={styles.recipeCardLink}
                >
                  <Card
                    image={
                      recipe.images?.[0]?.formats?.small?.url ||
                      recipe.images?.[0]?.url ||
                      '/placeholder.jpg'
                    }
                    cookingTime={recipe.cookingTime}
                    title={recipe.name}
                    subtitle={recipe.summary}
                    contentSlot={Math.round(recipe.calories).toString()}
                    actionSlot={<Button onClick={(e) => handleRemove(recipe, e)}>Удалить</Button>}
                  />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className={styles.pagination}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default FavoritesPage;
