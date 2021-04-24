import React, { useState, useEffect, createContext, useContext } from 'react';
import { ChatWidget, ContactsList, ChatNow } from './';
import { ChatList } from 'react-chat-elements';
import { Row, Col, Avatar } from 'antd';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useCookies } from 'react-cookie';
import { LeftOutlined, ContactsOutlined, WechatOutlined, UserOutlined } from '@ant-design/icons';
import { useGetAllOfflines, useGetLatestMsgsList } from './redux/hooks';
import _ from 'lodash';

export const ContactContext = createContext('');

export default function PrivateChatView() {
  const [cookies, setcookie, removeCookie] = useCookies(['user']);
  let userID = cookies.user;
  const [selectedKey, setSelectedKey] = useState('chats');
  const [userList, setUserList] = useState([]);
  const [clickUser, setClickUser] = useState({});
  const [noContact, setNoContact] = useState(false);
  const ws = new W3CWebSocket(`ws://192.168.1.76:8089/imserver/${userID}`);
  const { getAllOfflines } = useGetAllOfflines();
  const { getLatestMsgsList } = useGetLatestMsgsList();

  useEffect(() => {
    getLatestMsgsList({
      destination: userID,
    }).then(res => {
      let newLatestMsgList = [];
      _.forEach(res.data, v => {
        newLatestMsgList.unshift({
          avatar: v.avatarUrl,
          alt: v.nickname,
          title: v.nickname,
          subtitle: v.content,
          date: v.date,
          unread: v.offlineCount,
          id: v.source === userID ? v.destination : v.source,
        });
      });
      setUserList(newLatestMsgList);
      setClickUser(newLatestMsgList[0]);
      if (newLatestMsgList.length === 0) {
        setNoContact(true);
      }
    });
  }, [getLatestMsgsList, userID]);

  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket Client Connected.');
    };

    ws.onmessage = message => {
      const dataFormServer = JSON.parse(message.data);
      console.log('[parent]got reply!', dataFormServer);
    };
  }, [ws.onopen, ws.onmessage]);

  const onChatClick = e => {
    setClickUser(e);
    getAllOfflines({
      source: e.id,
      destination: userID,
    }).then(res => {
      _.forEach(res.data || [], offline => {
        const newMeg = {
          msgId: offline.msgId,
          type: 'MESSAGE_READ',
        };
        ws.send(JSON.stringify({ ...newMeg }));
      });
    });
    const newUserList = _.map(userList || [], v => {
      if ((v.id === e.id)) {
        return { ...v, unread: 0 };
      }
      return { ...v };
    });
    setUserList(newUserList);
    setNoContact(false);
  };

  return (
    <div className="chat-private-chat-view">
      <Row className="chat-body">
        <Col className="chat-list-column" span={7}>
          <div className="chat-list-column-title">
            <LeftOutlined className="chat-list-column-title-icon" />
            Chat
          </div>
          {/* <Input className="chat-list-column-search" placeholder="Recherche" onSearch={(e) => { console.log(e) }} suffix={<SearchOutlined />} /> */}
          <div className="chat-list-column-tabs">
            <div
              className={`chat-list-column-tab chat-list-column-tab${
                selectedKey === 'chats' ? '-selected' : '-unselected'
              }`}
              onClick={() => {
                setSelectedKey('chats');
              }}
            >
              <WechatOutlined />
              Chats
            </div>
            <div
              className={`chat-list-column-tab chat-list-column-tab${
                selectedKey === 'contacts' ? '-selected' : '-unselected'
              }`}
              onClick={() => {
                setSelectedKey('contacts');
                setNoContact(true);
              }}
            >
              <ContactsOutlined />
              Contacts
            </div>
          </div>
          {selectedKey === 'chats' ? (
            !_.isEmpty(userList) ? (
              <div>
                <div className="chat-list-title">Derniers chats</div>
                <ChatList
                  className="chat-list-content"
                  onClick={e => onChatClick(e)}
                  dataSource={userList}
                />
              </div>
            ) : (
              <div className="chat-list-tips">
                N'hésitez pas à avoir une conversation agréable avec les brainstormers qui vous
                intéressent.
              </div>
            )
          ) : (
            <ContactContext.Provider value={{ clickUser, setClickUser, noContact, setNoContact }}>
              <ContactsList key={userID} />
            </ContactContext.Provider>
          )}
        </Col>
        <Col span={17}>
          {noContact ? (
            <ChatNow />
          ) : (
            <ChatWidget receiver={clickUser} websocket={ws} senderId={userID} />
          )}
        </Col>
      </Row>
    </div>
  );
}
