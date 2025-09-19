import { Fragment } from 'react';

import { Outlet } from 'react-router-dom';

import Background from '../components/background/Background';

export default function Layout() {
  return <Fragment>
    <Background/>
    <Outlet/>
    <Background/>
  </Fragment>;
}