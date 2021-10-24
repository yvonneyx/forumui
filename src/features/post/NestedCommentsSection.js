import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import { Avatar, Button, message, Input } from 'antd';
import { DownCircleOutlined, DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled  } from '@ant-design/icons';
import { useCreateAComment, useLikeComment } from './redux/hooks';
import _ from 'lodash';
import { AvatarWithInvitation } from '../common';

export default function NestedCommentsSection(props) {
  const { loggedUserInfo = {}, parentComments } = props;
  let rootId = null;

  const [comments, setComments] = useState([]);
  const [replyIds, setReplyIds] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const { createAComment, createACommentPending } = useCreateAComment();
  const { likeComment } = useLikeComment();

  useEffect(()=>{
    setComments(parentComments)
  },[parentComments]);

  const likeCommentAction = comment => {
    likeComment({
      id: comment.id,
      like: !_.includes(comment.likePersons, loggedUserInfo.id) ? 1 : -1,
      dislike: 0,
      answerPeopleId: loggedUserInfo.id,
    }).then(()=>{
      let newComments = _.map(comments, c=>{
        if(c.id === comment.id){
          if(_.includes(c.likePersons, loggedUserInfo.id)){
            return {...c, like: c.like-1, likePersons: _.pull(c.likePersons, loggedUserInfo.id)}
          }else{
            return {...c, like: c.like+1, likePersons: _.concat(c.likePersons, loggedUserInfo.id)}
          }
        }else{
          return {...c}
        }
      })
      setComments([...newComments]);
    });
  }
    
  const dislikeCommentAction = (comment) => {
    likeComment({
      id: comment.id,
      like: 0,
      dislike: !_.includes(comment.dislikePersons, loggedUserInfo.id) ? 1 : -1,
      answerPeopleId: loggedUserInfo.id,
    }).then(()=>{
      let newComments = _.map(comments, c=>{
        if(c.id === comment.id){
          if(_.includes(c.dislikePersons, loggedUserInfo.id)){
            return {...c, dislike: c.dislike-1, dislikePersons: _.pull(c.dislikePersons, loggedUserInfo.id)}
          }else{
            return {...c, dislike: c.dislike+1, dislikePersons: _.concat(c.dislikePersons, loggedUserInfo.id)}
          }
        }else{
          return {...c}
        }
      })
      setComments([...newComments]);
    });
  }

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
    return <div className="comment-reply" key={`reply_${id}`} spin={createACommentPending}>
      <Avatar className="comment-reply-avatar" src={loggedUserInfo.avatarUrl} alt={loggedUserInfo.nickname} />
      <Input onPressEnter={e => { onReplyInputChange(e, id) }} onBlur={e => { onReplyInputChange(e, id) }} defaultValue={inputValues[id]} />
      <Button onClick={() => { handleReplySubmit(comment) }}>Répondre</Button>
    </div>
  };

  const CustomizedComment = (props) => {
    const { comment } = props;
    let loggedId = loggedUserInfo.id;
    return (
      <>
        <div className="comment" key={`comment_${comment.id}`}>
          <span className="comment-avatar">
            <AvatarWithInvitation className="comment-avatar" src={comment.avatar} loggedId={loggedId} avatarId={comment.author} />
          </span>
          <div className="comment-content">
            <div className="comment-content-author">
              <div className="comment-content-author-nickname">{comment.nickname}</div>
              <div className="comment-content-author-datetime">
                {moment(comment.date).fromNow()}
              </div>
            </div>
            <div className="comment-content-detail">{comment.content}</div>
            <div className="comment-content-actions">
              <div onClick={()=> likeCommentAction(comment) }>
                {!_.includes(comment.likePersons, loggedId) ? <LikeOutlined /> : <LikeFilled />}
                <span className="comment-content-actions-nb">{comment.like}</span>
              </div>
              <div onClick={()=> dislikeCommentAction(comment) }>
                {!_.includes(comment.dislikePersons, loggedId) ? <DislikeOutlined /> : <DislikeFilled />}
                <span className="comment-content-actions-nb">{comment.dislike}</span>
              </div>
              <div onClick={() => switchReplyView(comment)}>Reply to</div>
            </div>
          </div>
        </div>
        {_.includes(replyIds, comment.id) && replyEditor(comment)}
      </>
    );
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
      {comments.length > 3 && <div className="post-nested-comments-section-tip"><DownCircleOutlined />  Faites défiler vers le bas pour voir plus</div>}
    </div>
  );
};


NestedCommentsSection.propTypes = {};
NestedCommentsSection.defaultProps = {};
