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
} from 'antd';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';
// import { Pie } from '@ant-design/charts';
import { Pie } from 'ant-design-pro/lib/Charts';
import _ from 'lodash';
import moment from 'moment';
const { TextArea } = Input;

export default function PostView({ match }) {
  const postId = match.params.id;
  const [checkedValue, setCheckedValue] = useState(1);
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');

  // useEffect(()=>{
  //   findPostById();
  // },[findPostById]);

  const postDetail = {
    title: 'Describe yourself in one word',
    content: {
      answer1: 'enthusiastic',
      answer2: 'intersting',
      answer3: 'boring',
    },
    categoryId: 1,
    creatorId: 12,
    endTime: '2022-03-27T19:30:14.178+0000',
    access: 'public',
  };

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

  const autherDetail = {
    id: '24',
    userName: 'Real_Cauliflower_709',
    url:
      'data:image/jpeg;base64,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',
  };

  const accessTag = access => {
    return (
      <Tag className="post-post-view-tag" color={access === 'public' ? 'cyan' : 'volcano'}>
        {_.upperFirst(access)}
      </Tag>
    );
  };

  const onRadioChange = e => {
    setCheckedValue(e.target.value);
  };

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
      <Card>
        <h2>
          {postDetail.title}
          {accessTag(postDetail.access)}
        </h2>
        <div className="post-post-view-contents">
          {postDetail && !_.isEmpty(postDetail.content) ? (
            <div>
              <Radio.Group onChange={onRadioChange} value={checkedValue}>
                {_.map(_.keys(postDetail.content), key => {
                  return (
                    <Radio className="post-post-view-content" value={key}>
                      {postDetail.content[key]}
                    </Radio>
                  );
                })}
              </Radio.Group>
              <Button type="primary" className="post-post-view-submit">
                Partager mon avis
              </Button>
            </div>
          ) : (
            <Typography.Text type="secondary">
              ( <SmileOutlined /> Aucune option n'est actuellement disponible. )
            </Typography.Text>
          )}
        </div>
        <Typography.Text className="post-post-view-auther" type="secondary">
          ( Publié par &nbsp;
          <Avatar src={autherDetail.url} icon={<UserOutlined />} size={30} />{' '}
          {autherDetail.userName} )
        </Typography.Text>
      </Card>
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
    </div>
  );
}

PostView.propTypes = {};
PostView.defaultProps = {};
