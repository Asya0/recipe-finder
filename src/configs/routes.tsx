import { createBrowserRouter, Navigate } from 'react-router';
import App from '../App';
import RecipePage from '@/App/pages/RecipePage/RecipePage';
import FavoritesPage from '@/App/pages/FavoritesPage/FavoritesPage';
import RecipesPage from '@/App/pages/RecipesPage/RecipesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/recipes" replace />,
      },
      {
        path: '/recipes',
        element: <RecipesPage />,
      },
      {
        path: '/recipe/:documentId',
        element: <RecipePage />,
      },
      {
        path: '/favorites',
        element: <FavoritesPage />,
      },
      {
        path: '/profile',
        element: <RecipesPage />,
      },
      {
        path: '/categories',
        element: <RecipesPage />,
      },
      {
        path: '/products',
        element: <RecipesPage />,
      },
      {
        path: '/menu-items',
        element: <RecipesPage />,
      },
      {
        path: '/meal-planning',
        element: <RecipesPage />,
      },
    ],
  },
]);
