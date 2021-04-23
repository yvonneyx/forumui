import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Avatar, Popover, Button, message } from 'antd';
import { UserAddOutlined, SmileTwoTone } from '@ant-design/icons';
import { useSendInvitation, useVerifyFriendsRelation } from '../chat/redux/hooks';
import _ from 'lodash';

export default function AvatarWithInvitation(props) {
  const { src, icon, size, avatarId, loggedId } = props;
  const { sendInvitation, sendInvitationPending, sendInvitationError } = useSendInvitation();
  const {
    friendsRelation,
    verifyFriendsRelation,
    verifyFriendsRelationPending,
    verifyFriendsRelationError,
  } = useVerifyFriendsRelation();
  const [hasInvited, setHasInvited] = useState({});

  const popClick = () => {
    verifyFriendsRelation({
      userId: loggedId,
      friendId: avatarId,
    });
  };

  const sendInv = () => {
    loggedId
      ? sendInvitation({
          userId: loggedId,
          friendId: avatarId,
          statue: 0,
        })
          .then(() => {
            setHasInvited({ ...hasInvited, [loggedId - avatarId]: true });
          })
          .catch(() => {
            message.error({ description: "Échec de l'envoi de cette invitation." });
          })
      : message.error({ description: 'Refresh...' });
  };

  const popContent = () => {
    return friendsRelation === 1 ? (
      <div>Vous êtes déjà amis.</div>
    ) : hasInvited[loggedId - avatarId] || friendsRelation === 0 ? (
      <div className="inv-sent">
        <div>Invitation envoyée</div>
        <div className="inv-sent-sm">
          Veuillez attendre patiemment que l'autre partie accepte l'invitation.
        </div>
      </div>
    ) : (
      <Button
        type="text"
        size="small"
        onClick={() => {
          sendInv();
        }}
      >
        <UserAddOutlined />
        Ajouter ce brainstormer
      </Button>
    );
  };

  return (
    <div className="common-avatar-with-invitation">
      <Popover
        placement="topLeft"
        content={popContent}
        trigger="click"
        onClick={() => {
          popClick();
        }}
        width={100}
      >
        <Avatar src={src} icon={icon} size={size} />
      </Popover>
    </div>
  );
}

AvatarWithInvitation.propTypes = {};
AvatarWithInvitation.defaultProps = {};
