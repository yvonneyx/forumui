import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useFetchCategoriesList } from '../common/redux/hooks';
import _ from 'lodash';
import { PostsListContent } from '../post';

export default function CategoriesWidget() {
  const { categoriesList, fetchCategoriesList } = useFetchCategoriesList();
  const [ selectedKey, setSelectedKey] = useState(1);

  const icons = ["👩🏻‍💻", "🐶", "🎨", "🪁", "📱", "🎳", "👗",
    "🍔", "🎰", "👾", "🏥", "📗", "🎶", "📰", "🏝", "📸", "🌇", "🔬",
    "🏀", "👨‍🔧", "🧳", "🎮", "🎥", "✍️"];

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList])

  return (
    <div className="home-categories-widget">
      <div className="home-categories-widget-header">Categories</div>
      <div className="home-categories-widget-content">
        {_.map(categoriesList, (value, key) => {
          return <div className="home-categories-widget-content-item" onClick={()=>{setSelectedKey(key)}} >
            <div className="home-categories-widget-content-item-pic">{icons[key - 1]}</div>
            <div className="home-categories-widget-content-item-name">{value}</div>
          </div>
        })}
      </div>
      <PostsListContent category={selectedKey} categoryName={categoriesList[selectedKey]}/>
    </div>
  );
};

CategoriesWidget.propTypes = {};
CategoriesWidget.defaultProps = {};
