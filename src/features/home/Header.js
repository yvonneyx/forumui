import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';
import { Link, Prompt } from 'react-router-dom';
import { Space, Button, Menu, Dropdown, Switch, Divider, Popover } from 'antd';
import {
  MessageFilled,
  CheckCircleFilled,
  StopFilled,
  ProfileOutlined,
  SettingOutlined,
  LogoutOutlined,
  EditFilled,
  ContactsFilled,
} from '@ant-design/icons';
import { UserCard, HeaderSearchBox } from './';
import { useCookies } from "react-cookie";
import _ from 'lodash';
import useDocumentScrollThrottled from '../common/UseDocumentScrollThrottled';
import { ContactsList } from '../chat';

export default function Header() {
  // const [status, setStatus] = useState(true);
  const [cookies, setcookie, removeCookie] = useCookies(["user"]);
  const loggedId = cookies.user;

  const [shouldShowShadow, setShouldShowShadow] = useState(false);
  const shadowStyle = shouldShowShadow ? 'shadow' : '';

  useDocumentScrollThrottled(callbackData => {
    const { currentScrollTop } = callbackData;
    setShouldShowShadow(currentScrollTop > 2);
  });

  const logout = () => {
    removeCookie('user', loggedId, {path: "/"});
  }

  const menu = (
    <Menu className="home-header-menu">
      <Menu.ItemGroup key="stuff" title="Mes affaires">
        <Menu.Item key="profile" icon={<ProfileOutlined />}>
          <a className="profile-link" href="/setting-profile">Profil</a>
        </Menu.Item>
        {false && <Menu.Item key="setting" icon={<SettingOutlined />}>
          Paramètres utilisateur
        </Menu.Item>}
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Se déconnecter
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`home-header home-header-${shadowStyle}`}>
    <div className="home-header-container">
      <div className="home-header-logo">
        <Link to="/accueil">
          <img src={require('../../images/logo.svg')} alt="logo" />
        </Link>
        Forum Brainstorming
      </div>
      {_.isEmpty(loggedId) ? (
        <Space className="home-header-nav">
          <Button className="home-header-nav-btn home-header-nav-identifier" href="/login">
            S'identifier
          </Button>
          <Button className="home-header-nav-btn home-header-nav-inscrire" href="/signup">
            S'inscrire
          </Button>
        </Space>
      ) : (
          <Space className="home-header-nav" size="1px">
            <Popover placement="bottom" content={<div className="popover-contacts-content"><ContactsList isHeaderComponent="true"/></div>} trigger="click" >
              <Button icon={<ContactsFilled />} type="text" />
            </Popover>
            <Button icon={<MessageFilled />} type="text" href="/channel" />
            <Button icon={<EditFilled />} type="text" href="/new-post"/>
            <Divider type="vertical" />
            <Dropdown overlay={menu} trigger={['click']}>
              <div>
                <UserCard loggedId={loggedId}/>
              </div>
            </Dropdown>
          </Space>
        )}
        <div className="home-header-search"><HeaderSearchBox /></div>
        </div>
    </div>
  );
}

Header.propTypes = {};
Header.defaultProps = {};
