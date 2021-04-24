import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Layout, Spin } from 'antd';
import _ from 'lodash';
import { SendOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useGetAllMsgs } from './redux/hooks';
import { MessageList } from 'react-chat-elements';

const { Header, Footer, Content } = Layout;

const { TextArea } = Input;
export default function ChatWidget(props) {
  const { receiver = {}, senderId, websocket } = props;
  const [msgDataList, setMsgDataList] = useState([]);
  const [sendMsg, setSendMsg] = useState('');
  const [noticeVisible, setNoticeVisible] = useState('');
  const { getAllMsgs, getAllMsgsPending, getAllMsgsError } = useGetAllMsgs();
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(null);

  const clickButton = () => {
    if (!_.isEmpty(sendMsg)) {
      websocket.send(
        JSON.stringify({
          type: 'MESSAGE_UNREAD',
          contentText: sendMsg,
          toUserId: receiver.id,
          fromUserId: senderId,
        }),
      );
    }
  };

  const scrollToBottom = () => {
    if (!_.isEmpty(msgDataList)) {
      if (receiver.id !== msgDataList[msgDataList.length - 1].fromUserId) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToBottomDirect = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const onScroll = e => {
    const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
    if (scrollHeight - clientHeight === scrollTop) {
      setNoticeVisible(false);
    }
  };

  useEffect(() => {
    const receiverId = !_.isEmpty(receiver) ? receiver.id : 0;
    getAllMsgs({
      source: senderId,
      destination: receiverId,
    }).then(res => {
      const msgList = res.data;
      const newMegList = _.map(msgList || [], msg => {
        return {
          position: msg.source === senderId ? 'right' : 'left',
          type: 'text',
          text: msg.content,
          date: msg.date,
        };
      });
      setMsgDataList(newMegList);
    });
  }, [getAllMsgs, senderId, receiver]);

  useEffect(() => {
    websocket.onmessage = message => {
      const dataFormServer = JSON.parse(message.data).returnObject[0];
      console.log('got reply!', dataFormServer);
      //发送方收到服务器端的确认ACK
      if (dataFormServer.type === 'ACK') {
        setMsgDataList([
          ...msgDataList,
          {
            position: 'right',
            type: 'text',
            text: dataFormServer.contentText,
            date: dataFormServer.date,
          },
        ]);
        scrollToBottom();
        setSendMsg('');
      }
      //接收方收到服务器端转发发送方的信息
      if (
        dataFormServer.type === 'MESSAGE_UNREAD' &&
        parseInt(dataFormServer.fromUserId) !== dataFormServer.toUserId &&
        dataFormServer.fromUserId === receiver.id
      ) {
        setMsgDataList([
          ...msgDataList,
          {
            position: 'left',
            type: 'text',
            text: dataFormServer.contentText,
            date: dataFormServer.date,
            fromUserId: dataFormServer.fromUserId,
          },
        ]);
        if (dataFormServer.fromUserId === receiver.id) {
          websocket.send(
            JSON.stringify({
              msgId: dataFormServer.msgId,
              type: 'MESSAGE_READ',
            }),
          );
        }
        console.log('top', messagesEndRef.current.getBoundingClientRect().top);
        if (messagesEndRef.current.getBoundingClientRect().top > 258) {
          setNoticeVisible(true);
        }
      }
    };
  });

  useEffect(scrollToBottom);

  return (
    <Layout className="chat-chat-widget">
      <Header className="chat-chat-widget-title">{receiver == null ? '' : receiver.title}</Header>
      <Content>
        <Spin spinning={getAllMsgsPending}>
          <div className="chat-chat-widget-box" onScroll={onScroll} ref={messagesRef}>
            <MessageList className="message-list" dataSource={msgDataList} />
            <div ref={messagesEndRef} />
          </div>
        </Spin>
        {getAllMsgsError && (
          <div className="error">Échec du chargement d'une liste pour afficher tous messages.</div>
        )}
      </Content>
      <Footer className="chat-chat-widget-sendbox">
        {noticeVisible && (
          <div className="chat-chat-widget-notice" onClick={scrollToBottomDirect}>
            <CaretDownOutlined />
            &nbsp;Nouveau message
          </div>
        )}
        <div className="chat-chat-widget-sendbox-body">
          <TextArea
            autoSize={{ minRows: 2, maxRows: 2 }}
            onChange={e => {
              setSendMsg(e.target.value);
            }}
            value={sendMsg}
          />
        </div>
        <Button className="chat-chat-widget-sendbox-btn" type="primary" onClick={clickButton}>
          <SendOutlined />
        </Button>
      </Footer>
    </Layout>
  );
}
