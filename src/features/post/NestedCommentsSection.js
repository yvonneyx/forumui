import React, { useEffect, createElement, useState } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import { Avatar, Tooltip, Comment, Button, Form, message, Input, Divider } from 'antd';
import { DownOutlined, DownCircleOutlined } from '@ant-design/icons';
import { useCreateAComment, useFindCommentsById } from './redux/hooks';
import _ from 'lodash';

export default function NestedCommentsSection(props) {
  const { loggedUserInfo = {}, comments } = props;
  const postId = !_.isEmpty(comments) && _.first(comments).brainstormingId;
  let rootId = null;

  const [replyIds, setReplyIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const { createAComment, createACommentPending, createACommentError } = useCreateAComment();

  const switchReplyView = comment => {
    if (!_.includes(replyIds, comment.id)) {
      setReplyIds([...replyIds, comment.id]);
    } else {
      let newReplyIds = _.pull(replyIds, comment.id);
      setReplyIds([...newReplyIds]);
      setInputValues({ ...inputValues, [comment.id]: '' });
    }
  }

  const onReplyInputChange = (e, id) => {
    setInputValues({ ...inputValues, [id]: e.target.value })
  }

  const handleReplySubmit = comment => {
    if (!inputValues[comment.id]) {
      message.error("Vous devez taper quelque chose à commenter.");
      return;
    }
    createAComment({
      brainstormingId: comment.brainstormingId,
      author: loggedUserInfo.id,
      avatar: loggedUserInfo.avatarUrl || '',
      content: inputValues[comment.id],
      answerId: comment.id,
    }).then(res => {
      const newCommentDetail = res.data.ext.create;
      let newReplyIds = _.pull(replyIds, comment.id);
      setInputValues({ ...inputValues, [comment.id]: '' });
      setReplyIds([...newReplyIds]);
      props.setNewId(newCommentDetail.id);
    }).catch(() => {
      message.error('Veuillez réessayer plus tard...😭');
    })
  }

  const replyEditor = comment => {
    const { id } = comment;
    return <div className="comment-reply" key={`reply_${id}`}>
      <Avatar className="comment-reply-avatar" src={loggedUserInfo.avatarUrl} alt={loggedUserInfo.nickname} />
      <Input onPressEnter={e => { onReplyInputChange(e, id) }} onBlur={e => { onReplyInputChange(e, id) }} defaultValue={inputValues[id]} />
      <Button onClick={() => { handleReplySubmit(comment) }}>Répondre</Button>
    </div>
  };

  const CustomizedComment = (props) => {
    const { comment } = props;
    return <>
      <div className="comment" key={`comment_${comment.id}`}>
        <Avatar className="comment-avatar" src={comment.avatar} />
        <div className="comment-content">
          <div className="comment-content-author">
            <div className="comment-content-author-nickname">{comment.author}</div>
            <div className="comment-content-author-datetime">{moment(comment.date).fromNow()}</div>
          </div>
          <div className="comment-content-detail">{comment.content}</div>
          <div className="comment-content-actions"><div onClick={() => switchReplyView(comment)}>Reply to</div></div>
        </div>
      </div>
      {_.includes(replyIds, comment.id) && replyEditor(comment)}</>
  }

  const Comments = (props) => {
    let { comments, parentComment } = props;
    const partOfComments = comments.filter(c => c.answerId === parentComment.id)

    let childrenComments = partOfComments.map((c) => {
      return (<Comments key={c.id} parentComment={c} comments={comments} />)
    })

    if (childrenComments.length === 0) {
      return (
        <div className="comments">
          <CustomizedComment key={parentComment.id} comment={parentComment} />
        </div>
      )
    } else {
      return (
        <div className="comments">
          <CustomizedComment key={parentComment.id} comment={parentComment} />
          <div className="comments-children">{childrenComments}</div>
        </div>
      )
    }
  }

  const rootComments = comments.filter(c => c.answerId === rootId)
    .map(c => <Comments key={c.id} comments={comments} parentComment={c} />)

  return (
    <div className="post-nested-comments-section">
      <div className="post-nested-comments-section-header">{comments.length}&nbsp;{comments.length > 1 ? 'réponses' : 'réponse'}</div>
      <div className="post-nested-comments-section-content">{rootComments}</div>
      {comments.length > 5 && <div className="post-nested-comments-section-tip"><DownCircleOutlined />  Faites défiler vers le bas pour voir plus</div>}
    </div>
  );
};


NestedCommentsSection.propTypes = {};
NestedCommentsSection.defaultProps = {};
