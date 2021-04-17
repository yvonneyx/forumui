import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Space, Avatar } from 'antd';
import _ from 'lodash';

export default function ArticlesPopulaires({ props }) {
  const [idx, setIdx] = useState(0);
  let newIdx = 0;

  const mockArticles = [
    {
      id: 'xxx',
      title: 'What skills and qualities do you think you will need as an engineer? ',
      author: 'Lorem Ipsum',
      category: 'Travel',
    },
    {
      id: 'xxx',
      title: 'What stands for a symbol of evil?',
      author: 'Lorem Ipsum',
      category: 'Conseils',
    },
    {
      id: 'xxx',
      title: 'Who discovered the principle of the photoelectric effect?',
      author: 'Lorem Ipsum',
      category: 'Arts',
    },
    {
      id: 'xxx',
      title: 'How many autistic children and adults are there in the UK? ',
      author: 'Lorem Ipsum',
      category: 'Photographie',
    },
    {
      id: 'xxx',
      title:
        ' How long has the NAS worked / been working with autism...How long has the NAS worked / been working with autism..How long has the NAS worked / been working with autism',
      author: 'Lorem Ipsum',
      category: 'Sports',
    },
    {
      id: 'xxx',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non libero venenatis, sodales metus a, dapibus dui.',
      author: 'Lorem Ipsum',
      category: 'Lorem Ipsum',
    },
    {
      id: 'xxx',
      title: 'Who discovered the principle of the photoelectric effect?',
      author: 'Lorem Ipsum',
      category: 'Arts',
    },
  ];

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

  return (
    <div className="home-articles-populaires">
      <div className="home-articles-populaires-title">Les plus populaires</div>
      <div
        className="basic-arrow left-arrow"
        onClick={() => {
          idx === 0 ? (newIdx = mockArticles.length - 1) : (newIdx = idx - 1);
          setIdx(newIdx);
        }}
      ></div>
      <Space size="middle">
        {_.map(sliceOfArticles(mockArticles, 4, idx), item => {
          return (
            <div className="home-articles-populaires-item" onClick={() => { props.history.push(`/post/${item.id}`) }} >
              <div className="item-category">{item.category}</div>
              <div className="item-title">{item.title} </div>
              <div className="item-author">
                <div className="item-author-txt">Publié par </div>
                <br />
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                <div className="item-author-name">{item.author}</div>
              </div>
            </div>
          );
        })}
      </Space>
      <div
        className="basic-arrow right-arrow"
        onClick={() => {
          idx === mockArticles.length - 1 ? (newIdx = 0) : (newIdx = idx + 1);
          setIdx(newIdx);
        }}
      ></div>
    </div>
  );
}

ArticlesPopulaires.propTypes = {};
ArticlesPopulaires.defaultProps = {};
