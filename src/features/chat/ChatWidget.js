import React, { Component, createRef } from 'react';
import { MessageList } from 'react-chat-elements'
import { Button, Row, Col, Input } from "antd";

const { TextArea } = Input;

export default class ChatWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      msgDataList: [],
      sendMsg: "",
    }
    this.clickButton = this.clickButton.bind(this);
    this.messagesEnd = createRef();
  }

  componentDidMount() {
    let list = [];
    for (let i = 0; i < 10; ++i)
      list.push({
        position: 'left',
        type: 'text',
        text: 'hello' + i,
        date: new Date(),
      });
    this.setState({ msgDataList: list });
    this.setState({ user: this.props.user });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ user: nextProps.user });
  }

  clickButton() {
    let list = this.state.msgDataList;
    list.push({
      position: 'right',
      type: 'text',
      text: this.state.sendMsg,
      date: new Date(),
    })
    this.setState({ msgDataList: list });
    this.setState({ sendMsg: "" });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight;
  }

  render() {
    return (
        <Col className="chat-chat-widget">
          <Row className="chat-chat-widget-title">
            <Col className="chat-chat-widget-user">
              {this.state.user == null ? "" : this.state.user.title}
            </Col>
          </Row>
          <Row>
            <div className="chat-chat-widget-box"
              ref={(el) => {
                this.messagesEnd = el;
              }}
            >
              <MessageList
                className='message-list'
                dataSource={this.state.msgDataList}
              />
            </div>
          </Row>
          <Row>
            <Col className="chat-chat-widget-sendbox" span={20}>
              <TextArea autoSize={{ minRows: 2, maxRows: 3 }} onChange={e => {
                this.setState({ sendMsg: e.target.value });
              }}
                ref={el => (this.inputRef = el)}
                value={this.state.sendMsg} />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.clickButton}>Envoyer</Button>
            </Col>
          </Row>
        </Col>
    );
  }
}
