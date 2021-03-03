import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';
import { Link } from 'react-router-dom';
import { Space, Button } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

export default function Header() {
  return (
    <div className="home-header">
      <div className="home-header-logo">
          <Link to="/accueil"><img src={require('../../images/logo.svg')} alt="logo" /></Link>
          Forum Brainstorming
      </div>
      <Space className="home-header-nav">
        <Button shape="circle" icon={<CommentOutlined />} />
        <Button className="home-header-nav-btn home-header-nav-identifier" href="/login">S'identifier</Button>
        <Button className="home-header-nav-btn home-header-nav-inscrire" href="/register">S'inscrire</Button>
      </Space>
    </div>
  );
};

Header.propTypes = {};
Header.defaultProps = {};
