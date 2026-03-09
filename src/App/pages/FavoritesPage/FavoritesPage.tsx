import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './FavoritesPage.module.scss';
import { Button, Loading, Card, ErrorMessage, Pagination } from '@/components';
import { useRootStore } from '@/hooks/useRootStore';
import { Recipe } from '@/api/recipes';
import { usePagination } from '@/hooks/usePagination';

const PAGE_SIZE = 9;

const FavoritesPage = observer(() => {
  const { favorites } = useRootStore();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(favorites.savedCount / PAGE_SIZE);

  const { handlePageChange } = usePagination({
    totalPages,
    currentPage,
    onPageChange: (page) => setCurrentPage(page),
    scrollToTop: true,
  });

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentRecipes = favorites.savedRecipes.slice(startIndex, endIndex);

  useEffect(() => {
    favorites.fetchFavoriteRecipes();
  }, [favorites.favoriteIds.length]);

  const handleRemove = async (recipe: Recipe, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const recipeId = recipe.documentId || String(recipe.id);
    await favorites.removeFavorite(recipeId);
  };

  if (favorites.isLoading && favorites.savedCount > 0) {
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
          <Button onClick={() => favorites.fetchFavoriteRecipes()}>Повторить попытку</Button>
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
