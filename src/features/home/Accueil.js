import React from 'react';
// import PropTypes from 'prop-types';
import { ArticlesPopulaires, ArticlesListTab, CategoriesWidget } from './';
import { Row, Col } from 'antd';

export default function Accueil() {
  return (
    <div className="home-accueil">
      <div>
        <ArticlesPopulaires />
        <Row>
          <Col span={18}><CategoriesWidget /></Col>
          <Col span={6}><ArticlesListTab /></Col>
        </Row></div>
    </div>
  );
};

Accueil.propTypes = {};
Accueil.defaultProps = {};
