import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import {
  Card,
  Radio,
  Typography,
  Avatar,
  Button,
  Tag,
  Spin,
  Popover,
} from 'antd';
import { SmileOutlined, UserOutlined, CheckCircleTwoTone, StopTwoTone } from '@ant-design/icons';
import { Pie } from 'ant-design-pro/lib/Charts';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fr'
import { useFindPostById, useVote } from './redux/hooks';
import store from '../../common/store';
import { CommentView } from './';

export default function PostView({ match }) {
  const postId = match.params.id;
  const loggedId = parseInt(store.getState().home.loggedUserInfo && store.getState().home.loggedUserInfo.id);
  const [checkedValue, setCheckedValue] = useState(1);
  const [hasVoted, setHasVoted] = useState(false);
  const [answerDetail, setAnswerDetail] = useState([]);
  const { postDetail, findPostById, findPostByIdPending } = useFindPostById();
  const { vote, votePending } = useVote();
  const loggedUserInfo = store.getState().home.loggedUserInfo;

  useEffect(() => {
    findPostById({ id: postId });
  }, [findPostById, postId, hasVoted]);

  useEffect(() => {
    if (!_.isEmpty(postDetail)) {
      const { answerCount, content } = postDetail;
      setAnswerDetail(convertFormatPieDate(answerCount, content));
    }
  }, [postDetail]);

  const endTimeContent = (active, endTimeFr) => {
    return <div className="endtime-tag-popover">
      {active ? <p><CheckCircleTwoTone twoToneColor="#52c41a" />&emsp;Expirera {endTimeFr.fromNow()}</p> :
        <p><StopTwoTone twoToneColor="#eb2f96" /> &emsp;Expiré {endTimeFr.fromNow()}</p>}
      <p className="endtime-tag-popover-text"><b>Date limite de discussion: </b> {endTimeFr.format('LLLL')}</p>
    </div>
  }

  const isActive = endTime => {
    var active = endTime > moment(new Date()).format('x');
    var endTimeFr = moment(endTime).locale('fr');
    return (
      <Popover content={endTimeContent(active, endTimeFr)} >
        <Tag color={active ? 'green' : 'default'}>
          {active ? 'Actif' : 'Expiré'}
        </Tag>
      </Popover >
    );
  }

  const isActiveAndCanVote = postDetail => {
    const { endTime, participants, isAnswerIds, access } = postDetail;
    if (access === 'public') {
      return endTime > moment(new Date()).format('x') && !_.includes(isAnswerIds, loggedId)
    }
    return endTime > moment(new Date()).format('x') && _.includes(participants, loggedId)
      && !_.includes(isAnswerIds, loggedId);
  }

  const accessTag = access => {
    return (
      <Tag className="post-post-view-tag" color={access === 'public' ? 'cyan' : 'gold'}>
        {_.upperFirst(access)}
      </Tag>
    );
  };

  const onRadioChange = e => {
    setCheckedValue(e.target.value);
  };

  const toVote = checkedValue => {
    const answerRequest = {
      id: postId,
      answerNo: checkedValue,
      answerId: loggedId
    }
    vote(answerRequest).then(
      res => {
        setHasVoted(true);
      }
    )
  }

  const convertFormatPieDate = (answerCount, content) => {
    let answerFormat = [];
    _.mapKeys(content, (key, value) => {
      answerFormat.push({
        x: key,
        y: answerCount[value]
      })
    });
    return answerFormat;
  }

  const videResult = postDetail => {
    let vide = true;
    _.forEach(_.values(postDetail && postDetail.answerCount), v => {
      if (v !== 0) {
        vide = false;
      }
    });
    return vide;
  }

  return (
    <div className="post-post-view">
      <Spin spinning={findPostByIdPending}>
        {!_.isEmpty(postDetail) && <Spin spinning={votePending}><Card>
          <h2>
            {postDetail.title}
            {accessTag(postDetail.access)}
            {isActive(postDetail.endTime)}
          </h2>
          <div className="post-post-view-contents">
            {!_.isEmpty(postDetail.content) ?
              (<div>
                <Radio.Group onChange={onRadioChange} value={checkedValue}>
                  {_.map(_.keys(postDetail.content), key => {
                    return (
                      <Radio className="post-post-view-content" value={key} disabled={!isActiveAndCanVote(postDetail)}>
                        {postDetail.content[key]}
                      </Radio>
                    );
                  })}
                </Radio.Group>
                {isActiveAndCanVote(postDetail) && <Button type="primary" className="post-post-view-submit" onClick={() => toVote(checkedValue)}>
                  Partager mon avis
                </Button>}
              </div>
              ) : (
                <Typography.Text className="post-post-view-contents-aucune" type="secondary">
                  ( <SmileOutlined /> Aucune option n'est actuellement disponible. )
            </Typography.Text>
              )}
          </div>
          <Typography.Text className="post-post-view-auther" type="secondary">
            ( Publié par &nbsp;
          <Avatar src={postDetail.avatarUrl} icon={<UserOutlined />} size={30} />{' '}
            {postDetail.nickname} )
        </Typography.Text>
        </Card></Spin>}
        <Card title="Résultats statistiques" className="post-post-view-results">
          {!videResult(postDetail) ? <Pie
            hasLegend
            data={answerDetail}
            height={180}
            valueFormat={val => <span>{val > 1 ? `${val} votes` : `${val} vote`}</span>}
          /> : (<Typography.Text className="post-post-view-results-aucune" type="secondary">
            ( <SmileOutlined /> Aucune résultat n'est actuellement disponible. )
            </Typography.Text>)}
        </Card>
        <Card className="post-post-view-comments">
          {loggedUserInfo && <CommentView postId={postId} loggedUserInfo={loggedUserInfo}/>}
        </Card>
      </Spin>
    </div>
  );
}

PostView.propTypes = {};
PostView.defaultProps = {};
