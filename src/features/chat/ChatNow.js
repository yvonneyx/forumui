import React from 'react';
// import PropTypes from 'prop-types';
import { SendOutlined } from '@ant-design/icons';

export default function ChatNow() {
  return (
    <div className="chat-chat-now">
      <img src={require('../../images/chatnow.svg')} />
      <div className="chat-chat-now-text-l">Démarrer un chat directe!</div>
      <div className="chat-chat-now-text-s">
        Vous pouvez démarrer un nouveau chat direct avec le bouton <SendOutlined /> dans le contacts ou via la zone
        de recherche rapide.
      </div>
    </div>
  );
}

ChatNow.propTypes = {};
ChatNow.defaultProps = {};
