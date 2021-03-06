import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Tooltip
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterForm(props, ref) {
  const [form] = Form.useForm();
  const { values } = props;

  const onFinish = (values) => {
    return values;
  };

  useImperativeHandle(ref, () => ({
    validateFields: () => {
      return form.validateFields();
    }
  }), [form]);

  return (
    <div className="home-register-form">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          ...values
        }}
        scrollToFirstError
        validateTrigger="onBlur"
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'L\'entrée n\'est pas valide E-mail!',
            },
            {
              required: true,
              message: 'Veuillez saisir votre E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="nickname"
          label={
            <span>
              Nom d'utilisateur&nbsp;
            <Tooltip title="Votre nom d'utilisateur est la façon dont les autres membres de la communauté vous verront. Ce nom sera utilisé pour vous créditer pour les choses que vous partagez sur le brainstorming du forum. Comment devons-nous vous appeler?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: 'Veuillez saisir votre nom d\'utilisateur!',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mot de passe"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir votre mot de passe!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirmez le mot de passe"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Veuillez confirmer votre mot de passe!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Les deux mots de passe que vous avez saisis ne correspondent pas!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Link className="home-register-form-identifier" to="/login">
            Vous avez déjà un compte? S'identifier
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default forwardRef(RegisterForm);

RegisterForm.propTypes = {};
RegisterForm.defaultProps = {};
