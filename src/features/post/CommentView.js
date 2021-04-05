import React, { createElement, useEffect, useState } from 'react';
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

const { TextArea } = Input;

export default function CommentView(props) {
  const { postId, loggedUserInfo = {} } = props;
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);
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
    }).then(res => {
      const newCommentDetail = res.data.ext.create;
      console.log(newCommentDetail);
      setSubmitting(false);
      setInputValue('');
      setComments([...comments, {
        author: 'unknown',
        avatar: newCommentDetail.avatar,
        content: newCommentDetail.content,
        datetime: moment(newCommentDetail.date).locale('fr').fromNow(),
      }]);
    }).catch(() => {
      message.error('Veuillez réessayer plus tard...😭');
    })
  }

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} actions={actions} />}
    />
  );

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction('liked');
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction('disliked');
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span key="comment-basic-reply-to">Reply to</span>,
  ];

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
  }, [findCommentsById, postId])

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

  return (
    <div className="post-comment-view">
      {comments.length > 0 && <CommentList comments={optimizeComments(comments)} />}
      <Comment avatar={<Avatar src={loggedUserInfo.avatarUrl} alt={loggedUserInfo.nickname} />}
        content={
          <div>
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
          </div>
        }
      />
    </div>
  );
};

CommentView.propTypes = {};
CommentView.defaultProps = {};
