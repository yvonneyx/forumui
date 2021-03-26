import React from 'react';
// import PropTypes from 'prop-types';
import { Space, Card, Avatar } from 'antd';
const {Meta} = Card;
export default function ArticlesPopulaires() {

  const mockArticles = [{
    title: 'Lorem Ipsum',
    author: 'Lorem Ipsum',
  }, {
    title: 'Lorem Ipsum',
    author: 'Lorem Ipsum',
  }, {
    title: 'Lorem Ipsum',
    author: 'Lorem Ipsum',
  }, {
    title: 'Lorem Ipsum',
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
