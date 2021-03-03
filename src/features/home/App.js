import React from 'react';
import "antd/dist/antd.css";
import { Header } from './';

export default function App({ children }) {

  return (
    <div className="home-app">
      <Header />
      <div className="page-container">{children}</div>
    </div>
  );
}
