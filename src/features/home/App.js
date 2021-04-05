import React from 'react';
import { Header } from './';
import 'react-chat-elements/dist/main.css';
import "antd/dist/antd.css";

export default function App({ children }) {

  return (
    <div className="home-app">
      <Header />
      <div className="page-container">{children}</div>
      <div className="footer">Made with ❤ by Tao & Xin</div>
    </div>
  );
}
