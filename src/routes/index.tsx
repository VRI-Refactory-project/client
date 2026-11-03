import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { SessionEnded } from '../pages/SessionEnded';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/session-ended',
    element: <SessionEnded />,
  },
]);