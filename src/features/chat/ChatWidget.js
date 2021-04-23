import React, { Component, createRef, useEffect, useState } from 'react';
import { MessageList } from 'react-chat-elements';
import { Button, Row, Col, Input, message, Layout } from 'antd';
import _ from 'lodash';
import { SendOutlined } from '@ant-design/icons';
import { useGetAllMsgs } from './redux/hooks';

const { Header, Footer, Sider, Content } = Layout;

const { TextArea } = Input;

export default function ChatWidget(props) {
  const { receiver = {}, senderId, websocket } = props;
  const [msgDataList, setMsgDataList] = useState([]);
  const [sendMsg, setSendMsg] = useState('');
  const [idx, setIdx] = useState('');
  const { allMsgs, getAllMsgs, getAllMsgsPending, getAllMsgsError } = useGetAllMsgs();
  const connectNumbers = (a, b) => {
    return a > b ? `${b}-${a}` : `${a}-${b}`;
  };

  useEffect(() => {
    const receiverId = !_.isEmpty(receiver) ? receiver.id : 0;
    setIdx(connectNumbers(senderId, receiverId));
  }, [senderId, receiver]);

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
        setSendMsg('');
      }
      //接收方收到服务器端转发发送方的信息
      if (
        dataFormServer.type === 'MESSAGE_UNREAD' &&
        parseInt(dataFormServer.fromUserId) !== dataFormServer.toUserId
      ) {
        setMsgDataList([
          ...msgDataList,
          {
            position: 'left',
            type: 'text',
            text: dataFormServer.contentText,
            date: dataFormServer.date,
          },
        ]);
        if (dataFormServer.fromUserId === receiver.id) {
          websocket.send(JSON.stringify({
            msgId: dataFormServer.msgId,
            type: 'MESSAGE_READ',
          }));
        }
      }
    };
  });

  // componentWillReceiveProps(nextProps, nextContext) {
  //   this.setState({ receiver: nextProps.receiver }, () => {
  //     let index = this.connectNumbers(this.props.senderId, this.props.receiver.id);
  //     this.setState({ idx: index });
  //   });
  // }

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

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight;
  // }

  return (
    <Layout className="chat-chat-widget">
      <Header className="chat-chat-widget-title">{receiver == null ? '' : receiver.title}</Header>
      <Content
        className="chat-chat-widget-box"
        ref={el => {
          // this.messagesEnd = el;
        }}
      >
        <MessageList className="message-list" dataSource={msgDataList} />
      </Content>
      <Footer className="chat-chat-widget-sendbox">
        <div className="chat-chat-widget-sendbox-body">
          <TextArea
            autoSize={{ minRows: 2, maxRows: 2 }}
            onChange={e => {
              setSendMsg(e.target.value);
            }}
            // ref={el => (this.inputRef = el)}
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
