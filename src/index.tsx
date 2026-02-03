import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Provider } from 'react-redux';

import Home from './pages/Home';
import Game from './pages/Game';
import History from './pages/History';
import Layout from './pages/Layout';
import Header from './components/generic/Header';
import store from './store/store';

import './index.scss';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Header,
    children: [
      {
        Component: Layout,
        children: [
          {
            index: true,
            Component: Home
          },
          {
            path: 'history',
            Component: History
          }
        ]
      },
      {
        path: 'game',
        Component: Game
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