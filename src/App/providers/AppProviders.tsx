import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routesConfig } from '../../configs/routes';

const router = createBrowserRouter(routesConfig);

export const AppProviders = () => {
  return <RouterProvider router={router} />;
};
