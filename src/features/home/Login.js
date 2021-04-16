import React from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Button, Checkbox, Card, Row, Col, notification } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useLogin } from './redux/hooks';
import { useCookies } from "react-cookie";
import _ from 'lodash';

export default function Login(props) {
  const { login } = useLogin();
  const [ cookies, setCookie] = useCookies(["user"]);

  const onFinish = values => {
    login({ ...values }).then(
      (res) => {
        if (!_.isEmpty(res.data.ext)) {
          // bake_cookie(cookie_key, res.data.ext.id);
          setCookie("user", res.data.ext.id, {path: "/"});
          props.history.push('/accueil');
        } else {
          notification.error({
            message: 'Échec de la connexion',
            description:
              'Votre adresse e-mail ou votre mot de passe est incorrect.'
          })
        }
      }
    ).catch(
      ()=>{
        notification.error({
            message: 'Échec de la connexion',
            description:
              'Impossible de se connecter pour le moment.'
          })
      }
    )
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row className="home-login">
      <Col span={15} className="home-login-illu">
        <img src={require('../../images/bg1.svg')} alt="illustration" />
      </Col>
      <Col span={9} className="home-login-body">
          <div className="home-login-header">S'INDENTIFIER</div>
          <Form
            layout="vertical"
            className="home-login-form"
            name="basic"
            initialValues={{
              remember: false,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="email"
            >
              <Input className="custom-input" placeholder="E-mail" />
            </Form.Item>

            <Form.Item
              name="password"
            >
              <Input.Password className="custom-input" placeholder="Mot de passe"/>
            </Form.Item>

            <Form.Item >
              <Button type="primary" htmlType="submit" className="home-login-btn">
                <LoginOutlined />S'identifier
              </Button>
            </Form.Item>
            <Link className="home-login-inscrire" to="/signup">
              Vous n'avez pas de compte? S'inscrire
            </Link>
          </Form>
      </Col>
    </Row>
  );
}

Login.propTypes = {};
Login.defaultProps = {};
