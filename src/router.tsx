import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppRoutes from './routes';

// Create router with future flags enabled
const router = createBrowserRouter(
  [
    {
      path: '*',
      element: <AppRoutes />
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

// Router provider component
export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
}; 