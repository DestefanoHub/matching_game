import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter , RouterProvider, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';

import Home from './pages/Home';
import Game from './pages/Game';
import History from './pages/History';
import Layout from './pages/Layout';
import store from './store/store';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet/>,
    children: [
      {
        element: <Layout/>,
        children: [
          {
            index: true,
            element: <Home/>
          },
          {
            path: 'history',
            element: <History/>
          }
        ]
      },
      {
        path: 'game',
        element: <Game/>
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);