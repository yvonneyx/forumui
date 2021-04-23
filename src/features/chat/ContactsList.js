import React, { useEffect, useState, useContext } from 'react';
// import PropTypes from 'prop-types';
import {
  useGetPendingFriendsList,
  useRemoveInvitation,
  useAcceptInvitation,
  useGetFriendsList,
} from './redux/hooks';
import store from '../../common/store';
import _ from 'lodash';
import { Avatar, Popconfirm, notification, Popover, Input, Dropdown, Spin, message } from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  SendOutlined,
  UserDeleteOutlined,
  MailOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useVerifyFriendsRelation, useSendInvitation } from './redux/hooks';
import { ContactContext } from './PrivateChatView';

export default function ContactsList() {
  let { clickUser, setClickUser, noContact, setNoContact } = useContext(ContactContext);
  const {
    pendingFriendsList,
    getPendingFriendsList,
    getPendingFriendsListPending,
  } = useGetPendingFriendsList();
  const { removeInvitation } = useRemoveInvitation();
  const { acceptInvitation } = useAcceptInvitation();
  const {
    friendsList,
    getFriendsList,
    getFriendsListPending,
    getFriendsListError,
  } = useGetFriendsList();
  const { sendInvitation, sendInvitationPending, sendInvitationError } = useSendInvitation();
  const [hasInvited, setHasInvited] = useState({});

  let loggedId = 0;
  const [showPendingFriendsList, setShowPendingFriendsList] = useState(false);
  const [needPendingFrsUpdate, setNeedPendingFrsUpdate] = useState(false);
  const { friendsRelation, verifyFriendsRelation } = useVerifyFriendsRelation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchedUserInfo, setSearchedUserInfo] = useState({});

  if (store.getState().home.loggedUserInfo) {
    loggedId = parseInt(store.getState().home.loggedUserInfo.id);
  }

  useEffect(() => {
    getPendingFriendsList({ userId: loggedId });
  }, [getPendingFriendsList, loggedId, needPendingFrsUpdate]);

  useEffect(() => {
    getFriendsList({ userId: loggedId });
  }, [getFriendsList, loggedId, needPendingFrsUpdate]);

  const sendInv = friendId => {
    sendInvitation({
      userId: loggedId,
      friendId: friendId,
      statue: 0,
    })
      .then(() => {
        setHasInvited({ ...hasInvited, [`${loggedId}-${friendId}`]: true });
      })
      .catch(() => {
        message.error({ description: "Échec de l'envoi de cette invitation." });
      });
  };

  const popConfirm = userId => {
    acceptInvitation({
      userId: userId,
      friendId: loggedId,
      statue: 1,
    })
      .then(() => {
        setNeedPendingFrsUpdate(!needPendingFrsUpdate);
      })
      .catch(() => {
        notification.error({ description: 'Échec de accepter de cette invitation.' });
      });
  };

  const popCancel = userId => {
    removeInvitation({
      userId: userId,
      friendId: loggedId,
    })
      .then(() => {
        setNeedPendingFrsUpdate(!needPendingFrsUpdate);
      })
      .catch(() => {
        notification.error({ description: 'Échec de supprimer de cette invitation.' });
      });
  };

  const onSearch = value => {
    verifyFriendsRelation({
      userId: loggedId,
      nickname: value,
    }).then(res => {
      const user = { ...res.data.ext.user };
      setSearchedUserInfo(user);
      setDropdownVisible(true);
    });
  };

  const friendsRelationResult = friendsRelation => {
    if (friendsRelation === '-2') {
      return <div className="common-card-content">Le nickname n'existe pas.</div>;
    } else {
      return (
        !_.isEmpty(searchedUserInfo) && (
          <div className="common-card">
            <Avatar icon={<UserOutlined />} src={searchedUserInfo.avatarUrl} size={28} />
            {searchedUserInfo.nickname}
            {friendsRelation == -1 && !hasInvited[`${loggedId}-${searchedUserInfo.id}`] && (
              <Popconfirm
                title={`Ajouter le contact « ${_.startCase(searchedUserInfo.nickname)} ».`}
                okText="Ajouter le contact"
                cancelText="Annuler"
                icon={false}
                onConfirm={() => {
                  sendInv(searchedUserInfo.id);
                }}
              >
                <UserAddOutlined  className="common-card-plus" />
              </Popconfirm>
            )}
            {(friendsRelation == 0 || hasInvited[`${loggedId}-${searchedUserInfo.id}`]) && (
              <div className="common-card-ws">Déjà invité.</div>
            )}
            {friendsRelation == 1 && (
              <span>
                <SendOutlined className="common-card-plus common-card-plus-left" />
                <Popconfirm
                  title={`Supprimer le contact « ${_.startCase(
                    searchedUserInfo.nickname,
                  )} » et les Chats associés`}
                  okText="Supprimer le contact"
                  cancelText="Annuler"
                  icon={false}
                  onConfirm={() => {
                    popCancel(searchedUserInfo.id);
                  }}
                >
                  <UserDeleteOutlined className="common-card-plus" />
                </Popconfirm>
              </span>
            )}
          </div>
        )
      );
    }
  };

  const openChat = v => {
    setClickUser({ id: v.friendId, title: v.nickname });
    setNoContact(false);
  };

  return (
    <div className="chat-contacts-list">
      <Input
        className="chat-contacts-list-search"
        placeholder="Recherche"
        onPressEnter={e => {
          !_.isEmpty(e.target.value) && onSearch(e.target.value);
        }}
        onChange={e => {
          if (_.isEmpty(e.target.value)) {
            setDropdownVisible(false);
          }
        }}
        suffix={<SearchOutlined style={{ color: '#B8C2CF' }} />}
      />
      {dropdownVisible && (
        <div className="chat-contacts-list-search-result">
          {friendsRelationResult(friendsRelation)}
        </div>
      )}
      {!_.isEmpty(pendingFriendsList) && (
        <div className="common nouveaux-amis-part">
          <div className="common-title">
            Nouveaux amis
            <div className="nouveaux-amis-part-count">{pendingFriendsList.length}</div>
            <div
              className="nouveaux-amis-part-voir"
              onClick={() => {
                setShowPendingFriendsList(!showPendingFriendsList);
              }}
            >
              Voir tout
            </div>
          </div>
          {showPendingFriendsList && (
            <div className="nouveaux-amis-part-content">
              {pendingFriendsList.length > 0 && (
                <div className="nouveaux-amis-part-tip">
                  {pendingFriendsList.length > 1
                    ? `${pendingFriendsList.length} invitations`
                    : '1 invitation'}
                  .
                </div>
              )}
              {_.map(pendingFriendsList || [], v => {
                return (
                  <div className="common-card">
                    <Avatar icon={<UserOutlined />} src={v.avatarUrl} size={28} />
                    {v.nickname}
                    <Popconfirm
                      title={`${_.startCase(v.nickname)} vous a envoyé une invitation.`}
                      okText="Accepter"
                      cancelText="Supprimer"
                      icon={false}
                      onConfirm={() => {
                        popConfirm(v.userId);
                      }}
                      onCancel={() => {
                        popCancel(v.userId);
                      }}
                    >
                      <MailOutlined className="common-card-plus" />
                    </Popconfirm>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <div className="common amis-part">
        <div className="common-title">Amis</div>
        {getFriendsListPending ? (
          <div className="fetch">Fetching...</div>
        ) : !_.isEmpty(friendsList) ? (
          <Spin spinning={getFriendsListPending}>
            <div className="amis-part-content">
              {_.map(friendsList || [], v => {
                return (
                  <div className="common-card" key={v.id}>
                    <Avatar icon={<UserOutlined />} src={v.avatarUrl} size={28} />
                    {v.nickname}
                    <SendOutlined
                      className="common-card-plus common-card-plus-left"
                      onClick={() => {
                        openChat(v);
                      }}
                    />
                    <Popconfirm
                      title={`Supprimer le contact « ${_.startCase(
                        v.nickname,
                      )} » et les Chats associés`}
                      okText="Supprimer le contact"
                      cancelText="Annuler"
                      icon={false}
                      onConfirm={() => {
                        popCancel(v.friendId);
                      }}
                    >
                      <UserDeleteOutlined className="common-card-plus" />
                    </Popconfirm>
                  </div>
                );
              })}
            </div>
          </Spin>
        ) : (
          <div className="amis-part-content-aucune">Vous n'avez actuellement aucun ami</div>
        )}
        {getFriendsListError && (
          <div className="error">Échec du chargement d'une liste pour afficher tous vos amis.</div>
        )}
        {/* {pendingFriendsList.length > 3 && <div className="nouveaux-amis-part-plusicon"><CaretDownOutlined />&nbsp;Voir tout</div>} */}
      </div>
    </div>
  );
}
