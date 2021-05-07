import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useFindOneById, useUploadAvatar, useModifyOneById } from './redux/hooks';
import { Card, Form, Upload, Input, Typography, Button, Divider, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { serverUrl } from '../../common/globalConfig';
import store from '../../common/store';
import _ from 'lodash';
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

// const formEditorItemLayout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 32 },
// };

const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12, offset: 8 },
};

export default function Profile() {
  const { loggedUserInfo, findOneById } = useFindOneById();
  const { uploadAvatar } = useUploadAvatar();
  const { modifyOneById } = useModifyOneById();
  const loggedId = store.getState().home.loggedUserInfo && store.getState().home.loggedUserInfo.id;
  const [form] = Form.useForm();

  const [shownImgUrl, setShownImgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwdUpdate, setPwdUpdate] = useState(false);

  useEffect(() => {
     !_.isEmpty(loggedId) && findOneById(loggedId);
  }, [findOneById, loggedId]);

  useEffect(() => {
    const newLoggedUserInfo = _.omit(loggedUserInfo, 'image');
    form.setFieldsValue({ ...newLoggedUserInfo });
    if (loggedUserInfo && loggedUserInfo.avatarUrl) {
      setShownImgUrl(loggedUserInfo.avatarUrl);
    }
  }, [form, loggedUserInfo]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="avatar-uploader-hit">Upload</div>
    </div>
  );

  const beforeAvatarUpload = file => {
    const isJpgOrPng =
      file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Vous ne pouvez télécharger que des fichiers JPG / PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("L'image doit être inférieure à 2 Mo!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleAvatarChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
  };

  const uploadProps = {
    action: `${serverUrl}/User/fileUpload`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: file => {
      var formdata = new FormData();
      formdata.append('file', file);
      return formdata;
    },
    onSuccess: (res, file) => {
      setLoading(false);
      setShownImgUrl(res.data);
    },
    customRequest: args => {
      if (shownImgUrl) {
        setShownImgUrl('');
      }
      uploadAvatar({ ...args });
    },
  };

  const showSuccessMsg = () => {
    message.success('Modifié avec succès! 😊');
  };

  const showErrorMsg = () => {
    message.error("L'opération de modification a échoué. Veuillez réessayer plus tard...😭");
  };

  const onFinish = values => {
    _.has(values, 'new_password')
      ? modifyOneById({
          id: loggedId,
          nickname: values.nickname,
          email: values.eMail,
          avatarUrl: shownImgUrl,
          password: values.new_password,
          about: values.about,
        })
          .then(showSuccessMsg)
          .catch(showErrorMsg)
      : modifyOneById({
          id: loggedId,
          nickname: values.nickname,
          email: values.eMail,
          avatarUrl: shownImgUrl,
          about: values.about,
        })
          .then(showSuccessMsg)
          .catch(showErrorMsg);
  };

  return (
    <div className="home-profile" >
      <div className="home-profile-title">Mon profile</div>
      <Form
        form={form}
        onFinish={onFinish}
        {...formItemLayout}
        className="home-profile-form"
        validateTrigger="onBlur"
      >
        <Divider orientation="left">Informations sur le profile</Divider>
        <Form.Item
          label="E-mail"
          tooltip="L'adresse email est utilisée comme identifiant unique de l'utilisateur, la modification est interdite
."
        >
          <Typography.Text type="primary">
            {loggedUserInfo ? loggedUserInfo.email : ''}
          </Typography.Text>
        </Form.Item>
        <Form.Item
          name="nickname"
          label="Nom d'utilisateur"
          key="nickname"
          required
          hasFeedback
          rules={[
            {
              required: true,
              message:
                "Veuillez saisir votre nom d'utilisateur préféré afin que les membres de la communauté puissent vous connaître.",
            },
          ]}
          tooltip="Votre nom d'utilisateur est la façon dont les autres membres de la communauté vous verront. Ce nom sera utilisé pour vous créditer pour les choses que vous partagez sur le brainstorming du forum. Comment devons-nous vous appeler?"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Mot de passe" hidden={pwdUpdate}>
          <Button
            onClick={() => {
              setPwdUpdate(true);
              form.resetFields(['old_password', 'new_password', 'confirm']);
            }}
          >
            Modifier
          </Button>
        </Form.Item>
        {pwdUpdate && (
          <Form.Item
            name="old_password"
            label="Mot de passe actual"
            rules={[
              {
                required: true,
                message:
                  "Si vous souhaitez modifier le mot de passe, veuillez d'abord saisir le mot de passe que vous utilisez!",
              },
              {
                validator(_, value) {
                  return value === loggedUserInfo.password
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          'Veuillez vérifier que votre mot de passe est entré correctement!',
                        ),
                      );
                },
              },
            ]}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setPwdUpdate(false);
                }}
              >
                Conservez le mot de passe existant
              </Button>
            }
          >
            <Input.Password />
          </Form.Item>
        )}
        {pwdUpdate && (
          <Form.Item
            name="new_password"
            label="Nouveau mot de passe"
            tooltip="Le mot de passe doit être composé de 6 à 20 chiffres, lettres ou traits de soulignement, dont au moins deux, commençant par une lettre!"
            hasFeedback
            rules={[
              {
                pattern: /^[a-zA-Z](?![a-zA-Z]+$)\w{5,19}$/,
                message:
                  'Le mot de passe doit être composé de 6 à 20 chiffres, lettres ou traits de soulignement, dont au moins deux, commençant par une lettre!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        {pwdUpdate && (
          <Form.Item
            name="confirm"
            label="Confirmez le nouveau mot de passe"
            rules={[
              {
                required: true,
                message: 'Veuillez confirmer votre mot de passe!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue('new_password') === value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          'Les deux mots de passe que vous avez saisis ne correspondent pas!',
                        ),
                      );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          label="À propos (facultatif)"
          name="about"
          tooltip="Une brève description de vous-même affichée sur votre profil. Veuillez noter qu'il ne doit pas dépasser 200 caractères"
        >
          <TextArea rows={4} showCount maxLength={200} />
        </Form.Item>
        <Divider orientation="left">Image</Divider>
        <Form.Item
          name="avatar"
          label="Avatar"
          help="Les images doivent être au format .png ou .jpg"
        >
          <Upload
            name="avatorImg"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeAvatarUpload}
            onChange={handleAvatarChange}
            {...uploadProps}
          >
            {shownImgUrl ? (
              <img src={shownImgUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Button type="primary" htmlType="submit" className="submit-btn">
            Sauvegarder les modifications
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

Profile.propTypes = {};
Profile.defaultProps = {};
