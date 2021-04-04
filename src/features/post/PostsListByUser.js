import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { useFindPostsByUserId } from './redux/hooks';
import { Spin, List, Tag } from 'antd';
// import _ from 'lodash';
import { CrownFilled, SwapRightOutlined } from '@ant-design/icons';
// import store from '../../common/store';

export default function PostsListByUser(props) {
  const { postsListByUserId, findPostsByUserId, findPostsByUserIdPending } = useFindPostsByUserId();
  const { loggedId, hasNew } = props;
  // let categoriesList = store.getState().common.categoriesList || [];

  useEffect(() => {
    loggedId && findPostsByUserId({ creatorId: loggedId });
  }, [findPostsByUserId, loggedId, hasNew])

  return (
    <div className="post-posts-list-by-user">
      <Spin spinning={findPostsByUserIdPending}>
        <List
          className="post-posts-list-by-user-list"
          itemLayout="horizontal"
          size="small"
          header={<div className="post-posts-list-by-user-list-header">&nbsp;<CrownFilled style={{ color: '#ffe58f' }} />&nbsp;Brainstorming posté par moi</div>}
          dataSource={postsListByUserId}
          renderItem={item => (
            <List.Item key={item.id} className="post-posts-list-by-user-list-item">
              <a href={`/post/${item.id}`}>{item.title}</a>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
};

PostsListByUser.propTypes = {};
PostsListByUser.defaultProps = {};
