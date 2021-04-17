import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useFetchCategoriesList } from '../common/redux/hooks';
import _ from 'lodash';
import { PostsListContent } from '../post';

export default function CategoriesWidget() {
  const { categoriesList, fetchCategoriesList } = useFetchCategoriesList();
  const [ selectedKey, setSelectedKey] = useState(1);
  const [ expanded, setExpanded ] = useState(false);

  const icons = ["👩🏻‍💻", "🐶", "🎨", "🪁", "📱", "🎳", "👗",
    "🍔", "🎰", "👾", "🏥", "📗", "🎶", "📰", "🏝", "📸", "🌇", "🔬",
    "🏀", "👨‍🔧", "🧳", "🎮", "🎥", "✍️"];

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList])

  return (
    <div className="home-categories-widget">
      <div className="home-categories-widget-header">Categories</div>
      <div className="home-categories-widget-expand" onClick={()=>{setExpanded(!expanded)}}>...</div>
      <div className={ !expanded ? "home-categories-widget-content" : "home-categories-widget-content-expanded"}>
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
