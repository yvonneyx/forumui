import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useFindPostsByCategory } from './redux/hooks';
import { Spin, List, Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { FireOutlined } from '@ant-design/icons';

export default function PostsListContent(props) {
  const { category, categoryName } = props;
  const { postsListByCategory, findPostsByCategory, findPostsByCategoryPending } = useFindPostsByCategory();

  const isActive = (endTime) => {
    var active = endTime > moment(new Date()).format('x');
    return (
        <Tag icon={active && <FireOutlined />} color={active ? 'volcano' : 'default'}>
          {active ? 'Actif' : 'Expiré'}
        </Tag>
    );
  }

  useEffect(() => {
    findPostsByCategory({ categoryId: category });
  }, [findPostsByCategory, category])

  return (
    <div className="post-posts-list-content">
      <div className="post-posts-list-content-header">{`Tout sur le brainstorming de ${categoryName}`}</div>
      <Spin spinning={findPostsByCategoryPending}>
        <List
          className="post-posts-list-content-list"
          itemLayout="horizontal"
          bordered={true}
          size="small"
          dataSource={postsListByCategory}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<a href={`/post/${item.id}`}>{item.title}</a>}
              />
              <div>{isActive(item.endTime)}</div>
            </List.Item>
          )}
        />
        {_.map(postsListByCategory || [], post => {

        })}
      </Spin>
    </div>
  );
};

PostsListContent.propTypes = {};
PostsListContent.defaultProps = {};
