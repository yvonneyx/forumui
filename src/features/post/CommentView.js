import React, { createElement, useEffect, useState, useReducer } from 'react';
// import PropTypes from 'prop-types';
import { } from './redux/hooks';
import {
  Card,
  Radio,
  Typography,
  Avatar,
  Button,
  Comment,
  List,
  Input,
  Form,
  Tag,
  Spin,
  Popover,
  message,
  Tooltip,

} from 'antd';
import { } from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';
import { useCreateAComment, useFindCommentsById } from './redux/hooks';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import { NestedCommentsSection } from './';
import useForceUpdate from 'use-force-update';

const { TextArea } = Input;

export default function CommentView(props) {
  const { postId, loggedUserInfo = {} } = props;
  let rootId = null;

  const [replyId, setReplyId] = useState('');
  const [replyShow, setReplyShow] = useState(false);
  const [newId, setNewId] = useState('');
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);
  const [commentBoxVisble, setCommentBoxVisble] = useState(false);

  const { createAComment, createACommentPending, createACommentError } = useCreateAComment();
  const { findCommentsById, findCommentsByIdPending, findCommentsByIdError, } = useFindCommentsById();

  const handleCommentSubmit = () => {
    if (!inputValue) {
      message.error("Vous devez taper quelque chose à commenter.");
      return;
    }
    setSubmitting(true);
    loggedUserInfo && createAComment({
      brainstormingId: postId,
      author: loggedUserInfo.id,
      avatar: loggedUserInfo.avatarUrl || '',
      content: inputValue,
      answerId: null,
    }).then(res => {
      const newCommentDetail = res.data.ext.create;
      setSubmitting(false);
      setInputValue('');
      setNewId(newCommentDetail.id);
    }).catch(() => {
      message.error('Veuillez réessayer plus tard...😭');
    })
  }

  useEffect(() => {
    findCommentsById({ brainstormingId: postId }).then(res => {
      const existingComments = res.data;
      const existingCommentsFormat = _.map(existingComments, comment => {
        return {
          ...comment,
          datetime: moment(comment.date).locale('fr').fromNow(),
        }
      });
      setComments(existingCommentsFormat);
    });
  }, [findCommentsById, postId, newId])

  const optimizeComments = comments => {
    return _.map(comments || [], comment => {
      if (_.isEmpty(comment.avatar)) {
        comment.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
      }
      if (_.isEmpty(comment.author)) {
        comment.author = 'Unknown'
      }
      return { ...comment };
    })
  }

  const Editor = (<div>
    <Form.Item>
      <TextArea rows={4} onChange={e => { setInputValue(e.target.value); }} value={inputValue} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={handleCommentSubmit}
        type="primary"
      >
        Ajouter un commentaire
      </Button>
    </Form.Item>
  </div>);

  return (
    <div className="post-comment-view">
      <Comment avatar={<Avatar src={loggedUserInfo.avatarUrl} alt={loggedUserInfo.nickname} />}
        content={Editor}
      />
      {comments.length > 0 && <NestedCommentsSection comments={optimizeComments(comments)} loggedUserInfo={loggedUserInfo} setNewId={setNewId}/>}
    </div>
  );
};

CommentView.propTypes = {};
CommentView.defaultProps = {};
