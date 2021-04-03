import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import {
  Card,
  Radio,
  Typography,
  Avatar,
  Button,
  Comment,
  Tooltip,
  List,
  Input,
  Form,
  Tag,
  Spin,
  Popover,
} from 'antd';
import { SmileOutlined, UserOutlined, CheckCircleTwoTone, StopTwoTone } from '@ant-design/icons';
import { Pie } from 'ant-design-pro/lib/Charts';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fr'
import { useFindPostById } from './redux/hooks';
import { useCookies } from "react-cookie";
const { TextArea } = Input;

export default function PostView({ match }) {
  const postId = match.params.id;
  const [checkedValue, setCheckedValue] = useState(1);
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const { postDetail, findPostById, findPostByIdPending } = useFindPostById();
  const [cookies] = useCookies(["user"]);
  let loggedId = cookies.user;

  useEffect(() => {
    findPostById({ id: postId });
  }, [findPostById, postId]);

  const answerDetail = [
    {
      x: 'enthusiastic',
      y: 12,
    },
    {
      x: 'intersting',
      y: 18,
    },
    {
      x: 'boring',
      y: 1,
    },
  ];

  const endTimeContent = (active, endTimeFr) => {
    return <div className="endtime-tag-popover">
      {active ? <p><CheckCircleTwoTone twoToneColor="#52c41a" />&emsp;Expirera {endTimeFr.fromNow()}</p> :
        <p><StopTwoTone twoToneColor="#eb2f96" /> &emsp;Expiré {endTimeFr.fromNow()}</p>}
      <p className="endtime-tag-popover-text"><b>Date limite de discussion: </b> {endTimeFr.format('LLLL')}</p>
    </div>
  }

  const IsActive = endTime => {
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

  const IsActiveAndCanVote = postDetail => {
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

  const toVote = () => {
    debugger;
  }

  const handleSubmit = () => {
    if (!value) {
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        ...comments,
        {
          author: 'Han Solo',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: <p>{value}</p>,
          datetime: moment().fromNow(),
        },
      ]);
    }, 1000);
  };

  const CommentList = ({ comments }) => (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} />}
    />
  );

  return (
    <div className="post-post-view">
      <Spin spinning={findPostByIdPending}>
        {!_.isEmpty(postDetail) && <Card>
          <h2>
            {postDetail.title}
            {accessTag(postDetail.access)}
            {IsActive(postDetail.endTime)}
          </h2>
          <div className="post-post-view-contents">
            {!_.isEmpty(postDetail.content) ?
              (<div>
                <Radio.Group onChange={onRadioChange} value={checkedValue}>
                  {_.map(_.keys(postDetail.content), key => {
                    return (
                      <Radio className="post-post-view-content" value={key} disabled={!IsActiveAndCanVote(postDetail)}>
                        {postDetail.content[key]}
                      </Radio>
                    );
                  })}
                </Radio.Group>
                {IsActiveAndCanVote(postDetail) && <Button type="primary" className="post-post-view-submit" onClick={() => toVote(checkedValue)}>
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
        </Card>}
        <Card title="Résultats statistiques" className="post-post-view-results">
          <Pie
            hasLegend
            data={answerDetail}
            height={180}
            valueFormat={val => <span>{val > 1 ? `${val} votes` : `${val} vote`}</span>}
          />
        </Card>
        <Card className="post-post-view-comments">
          {comments.length > 0 && <CommentList comments={comments} />}
          <Comment
            avatar={
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            }
            content={
              <div>
                <Form.Item>
                  <TextArea
                    rows={4}
                    onChange={e => {
                      setValue(e.target.value);
                    }}
                    value={value}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    loading={submitting}
                    onClick={handleSubmit}
                    type="primary"
                  >
                    Add Comment
                </Button>
                </Form.Item>
              </div>
            }
          />
        </Card>
      </Spin>
    </div>
  );
}

PostView.propTypes = {};
PostView.defaultProps = {};
