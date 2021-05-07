import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import store from '../../common/store';
import _ from 'lodash';
import useForceUpdate from 'use-force-update';
import { useFindPostsByCategories } from '../post/redux/hooks';
import { Spin, List, Tag } from 'antd';
import moment from 'moment';
import { FireOutlined } from '@ant-design/icons';

export default function InterestingPostsWidget() {
  let categoryTypeLists =
    store.getState().home.loggedUserInfo && store.getState().home.loggedUserInfo.categoryTypeLists;
  let categoriesList = store.getState().common.categoriesList;
  const forceUpdate = useForceUpdate();
  const {
    postsByCategories,
    findPostsByCategories,
    findPostsByCategoriesPending,
  } = useFindPostsByCategories();

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

  useEffect(() => {
    // !_.isEmpty(categoryTypeLists) && findPostsByCategories({ categorys: categoryTypeLists });
    !_.isEmpty(categoryTypeLists) && findPostsByCategories({ categorys: [1, 21] });

  }, [categoryTypeLists, findPostsByCategories]);
  
  return (
    <div className="home-interesting-posts-widget">
      <div className="home-interesting-posts-widget-title">Recommandé en fonction de vos intérêts</div>
      {!_.isEmpty(postsByCategories) ? (
        <Spin spinning={findPostsByCategoriesPending}>
          <List
            className="home-interesting-posts-widget-list"
            itemLayout="horizontal"
            bordered={true}
            size="small"
            dataSource={_.orderBy(postsByCategories, 'updateTime', 'asc')}
            renderItem={item => (
              <List.Item>
                
                <List.Item.Meta title={<a href={`/post/${item.id}`}>{item.title}</a>} description={<Tag color="#4EB2D4">{categoriesList[item.categoryId]}</Tag>}/> 
              </List.Item>
            )}
          />
        </Spin>
      ): <div className="home-interesting-posts-widget-tip">
        <img src={require('../../images/new.svg')} />Le thème qui vous intéresse n'a publié aucun sujet lié au brainstorming. Pourquoi ne pas en créer un vous-même maintement ?</div>}
    </div>
  );
}

InterestingPostsWidget.propTypes = {};
InterestingPostsWidget.defaultProps = {};
