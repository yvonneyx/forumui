import React, { Component } from 'react';
import { ChatWidget } from './';
import { ChatList } from 'react-chat-elements'
import { Row, Col, Divider } from "antd";

export default class PrivateChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      clickUser: null,
    }
  }

  componentDidMount() {
    let list = [];
    for (let i = 0; i < 14; ++i)
      list.push({
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        alt: 'Reactjs',
        title: '用户' + i,
        subtitle: 'What are you doing?',
        date: new Date(),
        unread: Math.floor(Math.random() * 10),
      });
    this.setState({ userList: list });
    this.setState({ clickUser: list[0] });
  }

  render() {
    return (
      <div className="chat-private-chat-view">
        <Divider orientation="left">
          Liste de messages
        </Divider>
        <Row className="chat-body">
          <Col className="chat-list-column" span={7}>
            <ChatList
              className='chat-list'
              onClick={e => this.setState({ clickUser: e })}
              dataSource={this.state.userList} />
          </Col>
          <Col span={17}>
            {this.state.userList.length === 0 ? <div>Démarrer un chat directe
  Vous pouvez démarrer un nouveau chat direct avec le bouton ci-dessous ou à partir du
  profil de quelqu'un
</div> : <ChatWidget user={this.state.clickUser} />}
          </Col>
        </Row>
      </div>
    );
  }
}
