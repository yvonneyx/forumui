import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


const { Option } = Select;

export default function HeaderSearchBox() {

  return (
    <div className="home-header-search-box">
      <Select className="home-header-search-box-item" showSearch placeholder="Recherche rapide..." suffixIcon={<SearchOutlined />}>
      <Option value="lucy">lucy</Option>
      </Select>
    </div>
  );
};

HeaderSearchBox.propTypes = {};
HeaderSearchBox.defaultProps = {};
