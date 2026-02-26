// страница сохраненных рецептов
import { Link } from 'react-router-dom';
import styles from './FavoritesPage.module.scss';
import { Button } from '@/components';

const FavoritesPage = () => {
  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>У вас пока нет сохраненных рецептов</h2>
          <Link to="/recipes">
            <Button className={styles.exploreButton}>Найти рецепты</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
