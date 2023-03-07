import React from 'react';
import { useState } from 'react';

import { useRoutes, Navigate } from 'react-router-dom';

import './App.css';

import MainPage from './pages/MainPage/MainPage';

function App() {
  const routes = useRoutes([
    { path: '/', element: <MainPage /> },
    { path: '*', element: <Navigate to='/' replace /> },
  ]);

  return <>{routes}</>;
}

export default App;
