import { Fragment } from 'react';

import { Outlet } from 'react-router-dom';

import Background from '../components/Background';

const Layout = () => {
  return <Fragment>
    <Background/>
    <Outlet/>
    <Background/>
  </Fragment>;
}

export default Layout;