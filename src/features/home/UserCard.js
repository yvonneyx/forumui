import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';
import { Avatar, Badge } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { useFindOneById } from './redux/hooks';

export default function UserCard(props) {
  const {  loggedId } = props;
  const { loggedUserInfo, findOneById } = useFindOneById();

  useEffect(() => {
    findOneById(loggedId);
  }, [findOneById, loggedId])

  return (
    <div className="home-user-card">
      <span>
          <Avatar size="small" shape="square" icon={<UserOutlined />} 
          src={loggedUserInfo && loggedUserInfo.avatarUrl} />
      </span>
      <div className="home-user-card-icon">
        <DownOutlined />
      </div>
      <div className="home-user-card-text">
        <div className="home-user-card-username">{loggedUserInfo && loggedUserInfo.nickname}</div>
        {false && <div className="home-user-card-karma">1 karma</div>}
      </div>
    </div>
  );
}

UserCard.propTypes = {};
UserCard.defaultProps = {};
