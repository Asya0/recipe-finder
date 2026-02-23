import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.scss';
import RecipesPage from '@/pages/RecipesPage/RecipesPage';
import RecipePage from '@/pages/RecipePage/RecipePage';
import Header from '@/components/Header';
import FavoritesPage from '@/pages/FavoritesPage/FavoritesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<RecipesPage />} />
          <Route path="/recipe/:documentId" element={<RecipePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<RecipesPage />} />
          <Route path="/categories" element={<RecipesPage />} />
          <Route path="/products" element={<RecipesPage />} />
          <Route path="/menu-items" element={<RecipesPage />} />
          <Route path="/meal-planning" element={<RecipesPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
export default App;
