import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Select, Spin, Dropdown, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import _ from 'lodash';
import { useQuery } from './redux/hooks';

const { Option } = Select;

export default function HeaderSearchBox() {
  const [searchKey, setSearchKey] = useState('');
  const [options, setOptions] = useState([]);
  const { query, queryPending, queryError } = useQuery();
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

  // const highlightHTML = e => {
  //   return _.replace(e, new RegExp(searchKey,"gi"), '<span class="highlight">'+searchKey+'</span>')
  // }

  const menu = () => {
    return (
      <Menu>
        {_.map(options, option => {
          if (option.type === 'brainstorming' && option.found == 'title') {
            return (
              <Menu.Item className="menu-item">
                <a href={`/post/${option.id}`}>
                  <div>
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
                  </div>
                </a>
              </Menu.Item>
            );
          } else {
            return (
              <Menu.Item className="menu-item">
                <a href={`/post/${option.id}`}>
                  <div>
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
                  </div>
                </a>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  let showOptions;

  const onSearch = value => {
    setFetching(true);
    setSearchKey(value);
    query({
      param: value,
    }).then(res => {
      setFetching(false);
      setOptions(res.data);
      if (!_.isEmpty(res.data)) {
        setDropdownVisible(true);
      } else {
        setDropdownVisible(false);
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
        <Select
          className="home-header-search-box-item"
          showSearch
          placeholder="Recherche rapide..."
          suffixIcon={<SearchOutlined />}
          onSearch={onSearch}
          value={searchKey}
          notFoundContent={fetching ? <Spin size="small" /> : null}
        >
          {showOptions}
        </Select>
      </Dropdown>
    </div>
  );
}

HeaderSearchBox.propTypes = {};
HeaderSearchBox.defaultProps = {};
