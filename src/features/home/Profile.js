import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useFindOneById } from './redux/hooks';
import ImgCrop from 'antd-img-crop';
import { useCookies } from "react-cookie";
import { Card, Form, Upload, Input, Typography, Button, Divider } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { serverUrl } from '../../common/globalConfig';
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const formSpecialItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
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
  // const { loggedUserInfo, findOneById, findOneByIdPending, findOneByIdError } = useFindOneById();
  const [cookies] = useCookies(["user"]);
  let loggedId = cookies.user;

  const [form] = Form.useForm();

  // const [currentData, setCurrentData] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwdUpdate, setPwdUpdate] = useState(false);

  // useEffect(() => {
  //   findOneById(loggedId);
  //   setCurrentData(loggedUserInfo);
  // }, [findOneById])

  let currentData = {
    id: 22,
    userName: 'Ronan',
    password: 'Ronan',
    eMail: 'roantzh@gmail.com',
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="avatar-uploader-hit">Upload</div>
    </div>
  );

  // const onUploadPreview = async file => {
  //   let src = file.url;
  //   if (!src) {
  //     src = await new Promise(resolve => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj);
  //       reader.onload = () => resolve(reader.result);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow.document.write(image.outerHTML);
  // };

  const handleChange = info => {
    debugger;
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      debugger;
      setImageUrl(info.file.response.info);
    }
  };

  const onFinish = values => {
    console.log(values);
  };

  form.setFieldsValue({ ...currentData });

  return (
    <Card className="home-profile" title="Mon profile">
      <Form
        form={form}
        onFinish={onFinish}
        {...formItemLayout}
        className="home-profile-form"
        validateTrigger="onBlur"
      >
        <Divider orientation="left">INFORMATIONS SUR LE PROFIL</Divider>
        <Form.Item
          label="E-mail"
          tooltip="L'adresse email est utilisée comme identifiant unique de l'utilisateur, la modification est interdite
."
        >
          <Typography.Text type="primary">{currentData.eMail}</Typography.Text>
        </Form.Item>
        <Form.Item
          name="userName"
          label="Nom d'utilisateur"
          key="userName"
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
                  return value === currentData.password
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
        <Divider orientation="left">IMAGE</Divider>
        <Form.Item
          name="avatar"
          label="Avatar"
          help="Les images doivent être au format .png ou .jpg"
        >
          <ImgCrop rotate>
            <Upload
              name="avatorImg"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              // action={serverUrl + '/api/v1/common/file_upload'}
              onChange={info => handleChange(info)}
              // onPreview={onUploadPreview}
            >
              {imageUrl ? (
                <img src={serverUrl + imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Button type="primary" htmlType="submit" className="submit-btn">
            Sauvegarder les modifications
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

Profile.propTypes = {};
Profile.defaultProps = {};
