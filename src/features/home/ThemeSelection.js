import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { useFetchCategoriesList } from '../common/redux/hooks';
import _ from 'lodash';
const { CheckableTag } = Tag;

function ThemeSelection(props, ref) {
  const [selectedTagsInd, setSelectedTagsInd] = useState([]);
  const { categoriesList, fetchCategoriesList } = useFetchCategoriesList();

  const handleChange = (tag, checked) => {
    const nextSelectedTagsInd = checked ? [...selectedTagsInd, tag] : selectedTagsInd.filter(t => t !== tag);
    setSelectedTagsInd(nextSelectedTagsInd);
  }

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList])

  useImperativeHandle(ref, () => ({
    selectedTagsInd,
  }));

  return (
    <div className="home-theme-selection">
      <h2>Trouvez des thèmes qui vous intéressent.</h2>
      <h4>Le brainstorming du forum est rempli de thèmes basées sur les intérêts, offrant quelque chose pour tout le monde.
Forum brainstroming fonctionne mieux lorsque vous avez rejoint au moins 3 thèmes.</h4>
      <div className="home-theme-selection-themes"><h3 style={{ marginRight: 8 }}>Thèmes:</h3>
        {_.map((categoriesList || []), (value, key) => (
          <CheckableTag
            className="home-theme-selection-theme"
            key={value}
            checked={selectedTagsInd.indexOf(key) > -1}
            onChange={checked => handleChange(key, checked)}
          >
            {value}
          </CheckableTag>
        ))}</div>
    </div>
  );
};

export default forwardRef(ThemeSelection);

ThemeSelection.propTypes = {};
ThemeSelection.defaultProps = {};
