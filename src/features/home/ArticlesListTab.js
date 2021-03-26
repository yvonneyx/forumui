import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { ArticlesListContent } from './';
import { Tabs, Card } from 'antd';

const { TabPane } = Tabs;

export default function ArticlesListTab() {
  const [selectedCategory, setSelectedCategory] = useState('tous');

  const categories = [
    { tab: 'Tous', key: 'tous', content: ' Content of Tab Pane' },
    { tab: 'Jeux', key: 'jeux', content: ' Content of Tab Pane' },
    { tab: 'Films', key: 'films', content: ' Content of Tab Pane' },
    { tab: 'Livres', key: 'livres', content: ' Content of Tab Pane' },
    { tab: 'Education', key: 'education', content: ' Content of Tab Pane' },
    { tab: 'Nutrition', key: 'nutrition', content: ' Content of Tab Pane' },
    { tab: 'Les dessins animés', key: 'dessins', content: ' Content of Tab Pane' },
  ];

  const callback = (key) => {
    setSelectedCategory(key)
  }

  return (
    <div className="home-articles-list-tab">
      <Card title="Articles">
        <Tabs onChange={callback} defaultActiveKey="tous" size="small">
          {categories.map(item => {
            return (<TabPane tab={item.tab} key={item.key}>
              <ArticlesListContent category={selectedCategory} />
            </TabPane>)
          })}
        </Tabs>
      </Card>
    </div>
  );
};

ArticlesListTab.propTypes = {};
ArticlesListTab.defaultProps = {};
