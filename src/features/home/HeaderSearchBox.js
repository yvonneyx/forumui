import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import _ from 'lodash';
const { Option } = Select;

export default function HeaderSearchBox() {
  const [searchKey, setSearchKey] = useState('');
  const options = ["Lucy", "Tommy", "Luc"];
  const onSearch = value => {
    setSearchKey(value);
  }

  const onSelect = value => {
    setSearchKey('');
  }

  return (
    <div className="home-header-search-box">
      <Select className="home-header-search-box-item" showSearch placeholder="Recherche rapide..."
        suffixIcon={<SearchOutlined />} onSearch={onSearch} onSelect={onSelect}>
        {_.map(options, option => {
          return <Option value={option}>
            <a href={`/post/${option}`} className="home-header-search-box-option">
              <Highlighter
                highlightClassName="match-option-highlight"
                searchWords={[searchKey]}
                autoEscape={true}
                textToHighlight={option}
              />
            </a></Option>
        })}
      </Select>
    </div>
  );
};

HeaderSearchBox.propTypes = {};
HeaderSearchBox.defaultProps = {};
