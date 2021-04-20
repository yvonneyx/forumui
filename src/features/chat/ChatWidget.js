import React, { Component, createRef } from 'react';
import { MessageList } from 'react-chat-elements';
import { Button, Row, Col, Input, message, Layout } from 'antd';
import _ from 'lodash';
import { SendOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

const { TextArea } = Input;

export default class ChatWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiver: null,
      msgDataList: {},
      sendMsg: '',
      idx: '',
    };
    this.clickButton = this.clickButton.bind(this);
    this.connectNumbers = this.connectNumbers.bind(this);
    this.messagesEnd = createRef();
  }

  connectNumbers = (a, b) => {
    return a > b ? `${b}-${a}` : `${a}-${b}`;
  };

  componentDidMount() {
    this.setState({ receiver: this.props.receiver }, () => {
      let index = this.connectNumbers(this.props.senderId, this.props.receiver.id);
      this.setState({ idx: index });
    });
    this.props.websocket.onmessage = message => {
      const dataFormServer = JSON.parse(message.data).returnObject[0];
      console.log('got reply!', dataFormServer);
      if (
        dataFormServer.type === 'message' &&
        parseInt(dataFormServer.fromUserId) !== dataFormServer.toUserId
      ) {
        let idxFromAck = this.connectNumbers(dataFormServer.fromUserId, dataFormServer.toUserId);
        let messages = this.state.msgDataList[idxFromAck] || [];
        this.setState({
          msgDataList: {
            ...this.state.msgDataList,
            [idxFromAck]: [
              ...messages,
              {
                position: 'left',
                type: 'text',
                text: dataFormServer.contentText,
                date: dataFormServer.date,
              },
            ],
          },
        });
      }
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ receiver: nextProps.receiver }, () => {
      let index = this.connectNumbers(this.props.senderId, this.props.receiver.id);
      this.setState({ idx: index });
    });
  }

  clickButton = () => {
    this.props.websocket.send(
      JSON.stringify({
        type: 'message',
        contentText: this.state.sendMsg,
        toUserId: this.props.receiver.id,
      }),
    );
    let messages = this.state.msgDataList[this.state.idx] || [];
    this.setState({
      msgDataList: {
        ...this.state.msgDataList,
        [this.state.idx]: [
          ...messages,
          {
            position: 'right',
            type: 'text',
            text: this.state.sendMsg,
            date: new Date(),
          },
        ],
      },
    });
    this.setState({ sendMsg: '' });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight;
  }

  render() {
    console.log(this.state.msgDataList, this.state.idx);
    return (
      <Layout className="chat-chat-widget">
          <Header className="chat-chat-widget-title">
            {this.state.receiver == null ? '' : this.state.receiver.title}
          </Header>
          <Content
            className="chat-chat-widget-box"
            ref={el => {
              this.messagesEnd = el;
            }}
          >
            <MessageList
              className="message-list"
              dataSource={this.state.msgDataList[this.state.idx]}
            />
          </Content>
        <Footer className="chat-chat-widget-sendbox">
          <div className="chat-chat-widget-sendbox-body">
            <TextArea
              autoSize={{ maxRows: 2 }}
              onChange={e => {
                this.setState({ sendMsg: e.target.value });
              }}
              ref={el => (this.inputRef = el)}
              value={this.state.sendMsg}
            />
          </div>
          <div className="chat-chat-widget-sendbox-btn">
            <Button type="primary" onClick={this.clickButton}>
            <SendOutlined />
            </Button>
          </div>
        </Footer>
      </Layout>
    );
  }
}
