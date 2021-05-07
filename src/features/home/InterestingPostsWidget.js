import React, { useEffect,useState } from 'react';
// import PropTypes from 'prop-types';
import store from '../../common/store';
import _ from 'lodash';
import { PostsListContent } from '../post';
import useForceUpdate from 'use-force-update';
import { useFindPostsByCategory } from '../post/redux/hooks';
import { Spin, List, Tag } from 'antd';
import moment from 'moment';
import { FireOutlined } from '@ant-design/icons';

export default function InterestingPostsWidget() {
  let categoryTypeLists =
    store.getState().home.loggedUserInfo && store.getState().home.loggedUserInfo.categoryTypeLists;
  let categoriesList = store.getState().common.categoriesList;
 const [posts, setPosts] = useState([]);
  const forceUpdate = useForceUpdate();

  const {
    postsListByCategory,
    findPostsByCategory,
    findPostsByCategoryPending,
  } = useFindPostsByCategory();

  const isActive = endTime => {
    var active = endTime > moment(new Date()).format('x');
    return (
      <Tag icon={active && <FireOutlined />} color={active ? 'volcano' : 'default'}>
        {active ? 'Actif' : 'Expiré'}
      </Tag>
    );
  };

  useEffect(() => {
    store.subscribe(() => {
      forceUpdate();
    }, []);
  });

  // useEffect(() => {
  //   !_.isEmpty(categoryTypeLists) &&
  //     _.map(categoryTypeLists, key => {
  //       findPostsByCategory({ categoryId: key }).then(res=>{
  //         setPosts([...posts, res.data.ext])
  //       })
  //     });
  // });

  return (
    <div className="home-interesting-posts-widget">
      <div className="home-interesting-posts-widget-title">Plus intéressé</div>
      <Spin spinning={findPostsByCategoryPending}>
        <List
          className="post-posts-list-content-list"
          itemLayout="horizontal"
          bordered={true}
          size="small"
          dataSource={posts}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta title={<a href={`/post/${item.id}`}>{item.title}</a>} />
              <div>{isActive(item.endTime)}</div>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );
}

InterestingPostsWidget.propTypes = {};
InterestingPostsWidget.defaultProps = {};
