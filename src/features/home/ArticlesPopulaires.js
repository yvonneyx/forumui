import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Space, Avatar, Spin } from 'antd';
import _ from 'lodash';
import { useFindHotPosts } from '../post/redux/hooks';
import store from '../../common/store';
import useForceUpdate from 'use-force-update';

export default function ArticlesPopulaires({ props }) {
  let newIdx = 0;
  let categoriesList = store.getState().common.categoriesList;
  const { hotPosts = [], findHotPosts, findHotPostsPending, findHotPostsError } = useFindHotPosts();
  const forceUpdate = useForceUpdate();
  const [idx, setIdx] = useState(0);

  const sliceOfArticles = (data, n, idx) => {
    let length = data.length;
    let rest = length - idx;
    let newArr = [];
    if (rest > 0 && rest < n) {
      newArr = [...data.slice(length - rest, length), ...data.slice(0, n - rest)];
    } else if (rest >= n) {
      newArr = data.slice(idx, idx + n);
    }
    return newArr;
  };

  useEffect(() => {
    store.subscribe(() => {
      forceUpdate();
    }, []);
  });

  useEffect(() => {
    findHotPosts(6);
  }, [findHotPosts]);

  return (
    <div className="home-articles-populaires">
      <div className="home-articles-populaires-title">Les plus populaires</div>
      <div
        className="basic-arrow left-arrow"
        onClick={() => {
          idx === 0 ? (newIdx = hotPosts.length - 1) : (newIdx = idx - 1);
          setIdx(newIdx);
        }}
      ></div>
      <Spin spinning={findHotPostsPending}>
        {!findHotPostsError ? (
          <Space size="middle">
            {_.map(sliceOfArticles(hotPosts, 4, idx), item => {
              return (
                <div
                  className="home-articles-populaires-item"
                  onClick={() => {
                    props.history.push(`/post/${item.id}`);
                  }}
                  key={item.id}
                >
                  <div className="item-category">{categoriesList[item.categoryId]}</div>
                  <div className="item-title">{item.title} </div>
                  <div className="item-author">
                    <div className="item-author-txt">Publié par </div>
                    <br />
                    <Avatar src={item.avatarUrl} />
                    <div className="item-author-name">{item.nickname}</div>
                  </div>
                </div>
              );
            })}
          </Space>
        ) : (
          <div className="error">
            Échec du chargement d'une liste pour afficher les Brainstormings populaires.
          </div>
        )}
      </Spin>
      <div
        className="basic-arrow right-arrow"
        onClick={() => {
          idx === hotPosts.length - 1 ? (newIdx = 0) : (newIdx = idx + 1);
          setIdx(newIdx);
        }}
      ></div>
    </div>
  );
}

ArticlesPopulaires.propTypes = {};
ArticlesPopulaires.defaultProps = {};
