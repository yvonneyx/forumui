import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Button, Checkbox, Card, Row, Col,notification } from 'antd';
import { Link } from 'react-router-dom';
import { useLogin } from './redux/hooks';
import _ from 'lodash';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function Login(props) {
  const { loggedId, login, loginPending, loginError } = useLogin();

  const onFinish = values => {
    login({ ...values });
    setTimeout(() => {
      if (!_.isEmpty(loggedId)) {
        props.history.push('/accueil');
      } else {
        notification.error({
          message: 'Échec de la connexion',
          description:
            'Votre adresse e-mail ou votre mot de passe est incorrect.'
        })
      }
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row className="home-login">
      <Col span={12}>
        <img src={require('../../images/illustration.svg')} alt="illustration" />
      </Col>
      <Col span={12}>
        <Card title="S'identifier">
          <Form
            {...layout}
            className="home-login-form"
            name="basic"
            initialValues={{
              remember: false,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Rester connecté</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" className="home-login-btn">
                S'identifier
              </Button>
            </Form.Item>
            <Link className="home-login-inscrire" to="/signup">
              Vous n'avez pas de compte? S'inscrire
            </Link>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

Login.propTypes = {};
Login.defaultProps = {};
