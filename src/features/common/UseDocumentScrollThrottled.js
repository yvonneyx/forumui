import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { throttle } from 'lodash';

export default function UseDocumentScrollThrottled(callback) {
  const [, setScrollPosition] = useState(0);
  let previousScrollTop = 0;

  function handleDocumentScroll() {
    const { scrollTop: currentScrollTop } = document.documentElement || document.body;

    setScrollPosition(previousPosition => {
      previousScrollTop = previousPosition;
      return currentScrollTop;
    });

    callback({ previousScrollTop, currentScrollTop });
  }
  const handleDocumentScrollThrottled = throttle(handleDocumentScroll, 250);
  
  useEffect(() => {
    window.addEventListener('scroll', handleDocumentScrollThrottled);
    
    return () =>
      window.removeEventListener('scroll', handleDocumentScrollThrottled);
  }, [handleDocumentScrollThrottled]);
};

UseDocumentScrollThrottled.propTypes = {};
UseDocumentScrollThrottled.defaultProps = {};
