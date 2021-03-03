import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {} from './redux/hooks';

export default function ArticlesListContent(props) {
  const { category } = props;
  return (
    <div className="home-articles-list-content">
      {category}
    </div>
  );
};

ArticlesListContent.propTypes = {};
ArticlesListContent.defaultProps = {};
