import React from 'react';
import { Row, Col } from 'antd';

export default function SignupSuccess() {
  return (
    <Row className="home-signup-success">
      <Col span={12}>
        <img src={require('../../images/signup.svg')} alt="illustration" />
      </Col>
      <Col span={12} className="home-signup-success-content">
        <h1>Bienvenue!</h1>
        <h4>Félicitations, vous êtes devenu l'un des nôtres.</h4><h4>
        <a href="/login">Connectez-vous</a> maintenant pour commencer votre brainstorming!</h4>
      </Col>
    </Row>
  );
};

SignupSuccess.propTypes = {};
SignupSuccess.defaultProps = {};
