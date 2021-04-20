import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Avatar, Popover, Button, message } from 'antd';
import { UserAddOutlined, SmileTwoTone } from '@ant-design/icons';
import { useSendInvitation } from '../chat/redux/hooks';

export default function AvatarWithInvitation(props) {
  const { src, icon, size, avatarId, loggedId } = props;
  const { sendInvitation, sendInvitationPending, sendInvitationError } = useSendInvitation();
  const [hasInvited, setHasInvited] = useState({});

  const sendInv = () => {
    sendInvitation({
      userId: loggedId,
      friendId: avatarId,
      status: 0,
    }).then(() => {
      setHasInvited({ ...hasInvited, [loggedId - avatarId]: true });
    }).catch(()=>{
      message.error({description: 'Échec de l\'envoi de cette invitation.'})
    });
  };

  const popContent = () => {
    return hasInvited[loggedId - avatarId] ? (
      <div className="inv-sent"><SmileTwoTone twoToneColor="#eb2f96"/> Invitation envoyée. <br/><div className="inv-sent-sm">Veuillez attendre patiemment que l'autre partie accepte l'invitation.</div></div>
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
      <Popover placement="topLeft" content={popContent} trigger="click">
        <Avatar src={src} icon={icon} size={size} />
      </Popover>
    </div>
  );
}

AvatarWithInvitation.propTypes = {};
AvatarWithInvitation.defaultProps = {};
