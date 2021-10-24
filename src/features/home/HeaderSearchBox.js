import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Select, Spin, Dropdown, Menu, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import _ from 'lodash';
import { useQuery } from './redux/hooks';

export default function HeaderSearchBox() {
  const [searchKey, setSearchKey] = useState('');
  const [options, setOptions] = useState([]);
  const { query } = useQuery();
  const [fetching, setFetching] = React.useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const terme = {
    'comment-content': 'Commentaires',
    title: 'Titre',
    content: 'Options',
    description: 'Description',
    'title/content': 'Titre et Options',
    'title/description': 'Titre et Description',
    'description/content': 'Description et Options',
    'title/description/content': 'Titre, Description et Options',
  };

  const innerHTML = e => {
    const s = _.size(_.split(e, '^')) - 1;
    let newString = e;
    for (let i = 0; i < s / 2; i++) {
      newString = _.replace(_.replace(newString, '^', '<span class="highlight">'), '^', '</span>');
    }
    return newString;
  };

  const menu = () => {
    return (
      <Menu>
        {_.map(options, option => {
          if (option.type === 'noData') {
            return (
              <Menu.Item
                className="tip"
                onClick={() => {
                  setSearchKey('');
                  setDropdownVisible(false);
                }}
              >
                Aucun résultat pour le mot recherché.
              </Menu.Item>
            );
          }
          if (option.type === 'brainstorming' && option.found == 'title') {
            return (
              <Menu.Item className="menu-item" key={option.id}>
                <a href={`/post/${option.id}`} target="_blank" rel="noopener noreferrer">
                  <Highlighter
                    className="option-title"
                    highlightClassName="match-option-highlight"
                    searchWords={_.split(searchKey, ' ')}
                    autoEscape={true}
                    textToHighlight={option.title}
                  />
                  <div className="option-tip">
                    Trouvé dans <div className="option-tip-found">{terme[option.found]}</div>
                  </div>
                </a>
              </Menu.Item>
            );
          } else {
            return (
              <Menu.Item className="menu-item" key={option.id}>
                <a href={`/post/${option.id}`} target="_blank" rel="noopener noreferrer">
                  <Highlighter
                    className="option-title"
                    highlightClassName="match-option-highlight"
                    searchWords={_.split(searchKey, ' ')}
                    autoEscape={true}
                    textToHighlight={option.title}
                  />
                  <div
                    className="option-content"
                    dangerouslySetInnerHTML={{ __html: innerHTML(option.found_value) }}
                  />
                  {option.type === 'brainstorming' ? (
                    <div className="option-tip">
                      Trouvé dans <div className="option-tip-found">{terme[option.found]}</div>
                    </div>
                  ) : (
                    <div className="option-tip">
                      Trouvé dans{' '}
                      <div className="option-tip-found">{terme[`comment-${option.found}`]}</div>
                    </div>
                  )}
                </a>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  const onChange = e => {
    setSearchKey(e.target.value);
    if (_.isEmpty(e.target.value)) {
      setDropdownVisible(false);
    }
  };

  const onPressEnter = e => {
    setFetching(true);
    query({
      param: e.target.value,
    }).then(res => {
      setFetching(false);
      setDropdownVisible(true);
      setOptions(res.data);
      if (_.isEmpty(res.data)) {
        setOptions([{ type: 'noData' }]);
      }
    });
  };

  return (
    <div className="home-header-search-box">
      <Dropdown
        overlayClassName="searchOverlay"
        overlay={menu}
        placement="bottomCenter"
        visible={dropdownVisible}
      >
        <Input
          className="home-header-search-box-item"
          placeholder="Recherche rapide par 'Enter'"
          onPressEnter={onPressEnter}
          onChange={onChange}
          value={searchKey}
          prefix={<SearchOutlined />}
          suffix={fetching && <Spin size="small" />}
          allowClear
        />
      </Dropdown>
    </div>
  );
}

HeaderSearchBox.propTypes = {};
HeaderSearchBox.defaultProps = {};
