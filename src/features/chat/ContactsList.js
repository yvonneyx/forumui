import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { ChatList } from 'react-chat-elements';
import { useGetPendingFriendsList, useRemoveInvitation, useAcceptInvitation, useGetFriendsList } from './redux/hooks';
import store from '../../common/store';
import _ from 'lodash';
import { Avatar, Popconfirm, notification, Popover } from 'antd';
import { UserOutlined, UserAddOutlined, CaretDownOutlined, SendOutlined } from '@ant-design/icons';

export default function ContactsList() {
  const { pendingFriendsList, getPendingFriendsList, getPendingFriendsListPending } = useGetPendingFriendsList();
  const { removeInvitation } = useRemoveInvitation();
  const { acceptInvitation } = useAcceptInvitation();
  const { friendsList, getFriendsList, getFriendsListPending, getFriendsListError } = useGetFriendsList();
  const loggedId = parseInt(store.getState().home.loggedUserInfo && store.getState().home.loggedUserInfo.id);
  const [showPendingFriendsList, setShowPendingFriendsList] = useState(false);
  useEffect(() => {
    getPendingFriendsList({ userId: 4 });
  }, [getPendingFriendsList])

  useEffect(() => {
    getFriendsList({ userId: 4 });
  }, [getFriendsList])

  const popConfirm = (friendId) => {
    acceptInvitation({
      userId: loggedId,
      friendId: friendId,
      status: 1,
    }).catch(() => {
      notification.error({ description: "Échec de accepter de cette invitation." })
    })
  }

  const popCancel = (friendId) => {
    removeInvitation({
      userId: loggedId,
      friendId: friendId
    }).catch(() => {
      notification.error({ description: "Échec de supprimer de cette invitation." })
    })
  }
  return (
    <div className="chat-contacts-list">
      {pendingFriendsList && <div className="common nouveaux-amis-part">
        <div className="common-title">
          Nouveaux amis
        </div>
        <div className="nouveaux-amis-part-tip">
          {pendingFriendsList.length > 1 ? `${pendingFriendsList.length} invitations` : "1 invitation"}.
          <div className="nouveaux-amis-part-voir" onClick={() => { setShowPendingFriendsList(!showPendingFriendsList) }}>Voir tout</div>
        </div>
        {showPendingFriendsList && <div className="nouveaux-amis-part-content">
          {_.map(pendingFriendsList || [], v => {
            return <div className="common-card">
              <Avatar icon={<UserOutlined />} src={v.avatarUrl} size={28} />{v.nickname}
              <Popconfirm title={`${_.startCase(v.nickname)} vous a envoyé une invitation.`} okText="Accepter" cancelText="Supprimer" icon={false} onConfirm={() => { popConfirm(v.friendId) }} onCancel={() => { popCancel(v.friendId) }}>
                <UserAddOutlined className="common-card-plus" />
              </Popconfirm>
            </div>
          })}
        </div>}
      </div>}
      <div className="common amis-part">
        <div className="common-title">
          Amis
        </div>
        {getFriendsListPending ? "Fetching..." : <div className="amis-part-content" spin={getFriendsListPending}>
          {_.map(friendsList || [], v => {
            return <div className="common-card">
              <Avatar icon={<UserOutlined />} src={v.avatarUrl} size={28} />{v.nickname}
              <Popover content="Démarrer un nouveau chat.">
                <SendOutlined className="common-card-plus" />
              </Popover>
            </div>
          })}
        </div>}
        {getFriendsListError && "Échec du chargement d'une liste pour afficher tous vos amis."}
        {/* {pendingFriendsList.length > 3 && <div className="nouveaux-amis-part-plusicon"><CaretDownOutlined />&nbsp;Voir tout</div>} */}
      </div>
    </div>
  );
};

ContactsList.propTypes = {};
ContactsList.defaultProps = {};
