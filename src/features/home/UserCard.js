import React from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';
import { Avatar, Badge } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

export default function UserCard(props) {
  const { status } = props;

  return (
    <div className="home-user-card">
      <span>
        <Badge color={status ? '#87d068' : '#f50'} dot={!status}>
          <Avatar size="small" shape="square" icon={<UserOutlined />} />
        </Badge>
      </span>
      <div className="home-user-card-icon">
        <DownOutlined />
      </div>
      <div className="home-user-card-text">
        <div className="home-user-card-username">Real_Cauliflower_709</div>
        <div className="home-user-card-karma">1 karma</div>
      </div>
    </div>
  );
}

UserCard.propTypes = {};
UserCard.defaultProps = {};
