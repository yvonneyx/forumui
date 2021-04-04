import React from 'react';
// import PropTypes from 'prop-types';
import { ArticlesPopulaires, ArticlesListTab, CategoriesWidget } from './';
import { Row, Col } from 'antd';

export default function Accueil() {
  return (
    <div className="home-accueil">
      {false && <div><ArticlesPopulaires />
        <Row>
          <Col span={18}><ArticlesListTab /></Col>
          <Col span={6}><ArticlesListTab /></Col>
        </Row></div>}
      <CategoriesWidget />
    </div>
  );
};

Accueil.propTypes = {};
Accueil.defaultProps = {};
