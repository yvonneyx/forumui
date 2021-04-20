import React, { Component } from 'react';
import { ChatWidget } from './';
import { ChatList } from 'react-chat-elements';
import { Row, Col, Divider, message } from 'antd';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";

class PrivateChatView extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  state = {
    userList: [],
    clickUser: null,
    userID: this.props.cookies.get("user") || "",
  };

  ws = new W3CWebSocket(`ws://192.168.1.76:8089/imserver/${this.state.userID}`);

  componentDidMount() {
    console.log(this.props.cookies);

    this.ws.onopen = () => {
      console.log('WebSocket Client Connected.');
    };

    this.ws.onmessage = message => {
      const dataFormServer = JSON.parse(message.data);
      console.log('[parent]got reply!', dataFormServer);
    }

    // this.ws.onclose = () => {
    //   console.log('Disconnected.');
    // }

    let list = [];
    list.push({
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      alt: 'Reactjs',
      title: 'Cecile',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: Math.floor(Math.random() * 10),
      id: 6,
    });
    list.push({
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      alt: 'Reactjs',
      title: 'Sunny',
      subtitle: 'What are you doing?',
      date: new Date(),
      unread: Math.floor(Math.random() * 10),
      id: 5,
    });
    this.setState({ userList: list });
    this.setState({ clickUser: list[0] });
  }

  render() {
    return (
      <div className="chat-private-chat-view">
        <Divider orientation="left">Liste de messages</Divider>
        <Row className="chat-body">
          <Col className="chat-list-column" span={7}>
            <ChatList
              className="chat-list"
              onClick={e => this.setState({ clickUser: e })}
              dataSource={this.state.userList}
            />
          </Col>
          <Col span={17}>
            {this.state.userList.length === 0 ? (
              <div>
                Démarrer un chat directe Vous pouvez démarrer un nouveau chat direct avec le bouton
                ci-dessous ou à partir du profil de quelqu'un
              </div>
            ) : (
                <ChatWidget receiver={this.state.clickUser} websocket={this.ws} senderId={this.state.userID}/>
              )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default withCookies(PrivateChatView);