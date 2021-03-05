import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';
import { Link } from 'react-router-dom';
import { Space, Button, Menu, Dropdown, Switch, Divider } from 'antd';
import {
  MessageFilled,
  CheckCircleFilled,
  StopFilled,
  ProfileOutlined,
  SettingOutlined,
  LogoutOutlined,
  EditFilled,
} from '@ant-design/icons';
import { UserCard } from './';

export default function Header() {
  let loggedIn = true;
  const [status, setStatus] = useState(true);

  const onChange = checked => {
    setStatus(checked);
  };

  const menu = (
    <Menu className="home-header-menu">
      <Menu.ItemGroup key="g1" title="Statut">
        <Menu.Item
          key="statut"
          icon={
            status ? (
              <CheckCircleFilled style={{ color: '#52c41a' }} />
            ) : (
              <StopFilled style={{ color: '#f5222d' }} />
            )
          }
        >
          {status ? 'Disponible' : 'Occupé'}
          <Switch
            className="home-header-menu-switch"
            defaultChecked={status}
            size="small"
            onChange={onChange}
          />
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup key="stuff" title="Mes affaires">
        <Menu.Item key="profile" icon={<ProfileOutlined />}>
          Profil
        </Menu.Item>
        <Menu.Item key="setting" icon={<SettingOutlined />}>
          Paramètres utilisateur
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Se déconnecter
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="home-header">
      <div className="home-header-logo">
        <Link to="/accueil">
          <img src={require('../../images/logo.svg')} alt="logo" />
        </Link>
        Forum Brainstorming
      </div>
      {!loggedIn ? (
        <Space className="home-header-nav">
          <Button className="home-header-nav-btn home-header-nav-identifier" href="/login">
            S'identifier
          </Button>
          <Button className="home-header-nav-btn home-header-nav-inscrire" href="/register">
            S'inscrire
          </Button>
        </Space>
      ) : (
        <Space className="home-header-nav" size="1px">
          <Button icon={<MessageFilled />} type="text" />
          <Button icon={<EditFilled />} type="text" />
          <Divider type="vertical" />
          <Dropdown overlay={menu} trigger={['click']}>
            <div>
              <UserCard status={status} />
            </div>
          </Dropdown>
        </Space>
      )}
    </div>
  );
}

Header.propTypes = {};
Header.defaultProps = {};
