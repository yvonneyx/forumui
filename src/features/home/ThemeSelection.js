import React, { useState, useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Tag } from 'antd';

const { CheckableTag } = Tag;

const tagsData = ['Conseils', 'Animaux', 'Art', 'Bricolage', 'Électronique', 'Divertissement',
  'Mode', 'Nourriture', 'Drôle', 'Jeux', 'Santé', 'Mèmes', 'Musique', 'Actualités', 'Activités',
  'Photographie', 'Images', 'Science', 'Sports', 'Technologie', 'Voyage', 'Jeux vidéo', 'Vidéos', 'Écriture'];

function ThemeSelection(props, ref) {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    setSelectedTags(nextSelectedTags);
  }

  useImperativeHandle(ref, () => ({
    selectedTags,
  }));

  return (
    <div className="home-theme-selection">
      <h2>Trouvez des thèmes qui vous intéressent.</h2>
      <h4>Le brainstorming du forum est rempli de thèmes basées sur les intérêts, offrant quelque chose pour tout le monde.
Forum brainstroming fonctionne mieux lorsque vous avez rejoint au moins 3 thèmes.</h4>
      <div className="home-theme-selection-themes"><h3 style={{ marginRight: 8 }}>Thèmes:</h3>
        {tagsData.map(tag => (
          <CheckableTag
            className="home-theme-selection-theme"
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={checked => handleChange(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}</div>
    </div>
  );
};

export default forwardRef(ThemeSelection);

ThemeSelection.propTypes = {};
ThemeSelection.defaultProps = {};
