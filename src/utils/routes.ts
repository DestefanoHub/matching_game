import Home from '../pages/Home';
import Game from '../pages/Game';
import History from '../pages/History';
import Layout from '../pages/Layout';
import Header from '../components/generic/Header';

const routes = [
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
];

export default routes;