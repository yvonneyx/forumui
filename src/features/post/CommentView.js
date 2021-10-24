import React, { createElement, useEffect, useState, useReducer } from 'react';
// import PropTypes from 'prop-types';
import { } from './redux/hooks';
import {
  Avatar,
  Button,
  Comment,
  Input,
  Form,
  message,
} from 'antd';
import { } from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment';
import { useCreateAComment, useFindCommentsById } from './redux/hooks';
import { NestedCommentsSection } from './';

const { TextArea } = Input;

export default function CommentView(props) {
  const { postId, loggedUserInfo = {} } = props;

  const [newId, setNewId] = useState('');
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { createAComment} = useCreateAComment();
  const { findCommentsById } = useFindCommentsById();

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
      {comments.length > 0 && <NestedCommentsSection parentComments={optimizeComments(comments)} loggedUserInfo={loggedUserInfo} setNewId={setNewId}/>}
    </div>
  );
};

CommentView.propTypes = {};
CommentView.defaultProps = {};
