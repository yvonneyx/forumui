import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { ArticlesPopulaires, ArticlesListTab } from './';
import { Row, Col } from 'antd';

export default function Accueil() {
  return (
    <div className="home-accueil">
      <ArticlesPopulaires />
      <Row>
        <Col span={18}><ArticlesListTab /></Col>
        <Col span={6}><ArticlesListTab /></Col>
      </Row>
    </div>
  );
};

Accueil.propTypes = {};
Accueil.defaultProps = {};
