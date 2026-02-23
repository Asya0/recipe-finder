// страница сохраненных рецептов
import { Link } from 'react-router-dom';
import styles from './FavoritesPage.module.scss';

const FavoritesPage = () => {
  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>У вас пока нет сохраненных рецептов</h2>
          <Link to="/recipes">
            <button className={styles.exploreButton}>Найти рецепты</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
