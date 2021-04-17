import React from 'react';
// import PropTypes from 'prop-types';
import { ArticlesPopulaires, CategoriesWidget } from './';
import { Row, Col } from 'antd';

export default function Accueil(props) {
  return (
    <div className="home-accueil">
        <ArticlesPopulaires props={props} />
        <Row>
          <Col span={18} className="col"><CategoriesWidget /></Col>
          <Col span={6}><div className="green"></div></Col>
        </Row>
    </div>
  );
};

Accueil.propTypes = {};
Accueil.defaultProps = {};
