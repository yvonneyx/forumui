import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import _ from 'lodash';
import { Space, Card, Avatar } from 'antd';
const {Meta} = Card;
export default function ArticlesPopulaires() {

  const mockArticles = [{
    title: 'Lorem Ipsum1',
    author: 'Lorem Ipsum',
  }, {
    title: 'Lorem Ipsum2',
    author: 'Lorem Ipsum',
  }, {
    title: 'Lorem Ipsum3',
    author: 'Lorem Ipsum',
  }, {
    title: 'Lorem Ipsum4',
    author: 'Lorem Ipsum',
  }];

  return (
    <div className="home-articles-populaires">
      <Space size="middle">
        {mockArticles.map((item) => {
          return (
            <Card
               className="home-articles-populaires-card"
              hoverable
              cover={<img src="https://source.unsplash.com/random" alt="avatar" className="img"/>}
              bordered={false}
              key={_.camelCase(item.title)}
            >
              <Meta avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} title={item.title} 
              description={`By ${item.author}`} />
            </Card>
          )
        })}
      </Space>
    </div>
  );
};

ArticlesPopulaires.propTypes = {};
ArticlesPopulaires.defaultProps = {};
