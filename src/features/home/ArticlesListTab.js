import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { PostsListContent } from '../post';
import { Tabs, Card } from 'antd';
import { useFetchCategoriesList } from '../common/redux/hooks';
import _ from 'lodash';

const { TabPane } = Tabs;

export default function ArticlesListTab() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const { categoriesList, fetchCategoriesList } = useFetchCategoriesList();

  const categoriesFormat = (categoriesList) => {
    let categories = [];
    _.forIn(categoriesList, (value, key) => {
      categories.push({
        tab: value,
        key: key
      })
    });
    return categories;
  }

  const callback = (key) => {
    setSelectedCategory(key)
  }

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList])

  return (
    <div className="home-articles-list-tab">
        <div className="home-articles-list-tab-header">Afficher tous les Brainstorming</div>
        <Tabs className="home-articles-list-tab-content" onChange={callback} defaultActiveKey="1" tabPosition="left" type="card" size="small">
          {(categoriesFormat(categoriesList) || []).map(item => {
            return (<TabPane tab={item.tab} key={item.key}>
              <PostsListContent category={selectedCategory} />
            </TabPane>)
          })}
        </Tabs>
    </div>
  );
};

ArticlesListTab.propTypes = {};
ArticlesListTab.defaultProps = {};
