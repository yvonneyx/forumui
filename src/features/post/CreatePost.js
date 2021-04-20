import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Card, Form, Select, Button, Input, DatePicker, Typography, message, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';
import { useFetchUserList } from '../home/redux/hooks';
import { useFetchCategoriesList } from '../common/redux/hooks';
import { useCreatePost } from './redux/hooks';
import store from '../../common/store';
import useForceUpdate from 'use-force-update';
import moment from 'moment';
import _ from 'lodash';
import { PostsListByUser } from './';

const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
  labelAlign: 'left',
};

export default function CreatePost(props) {
  const [access, setAccess] = useState('public');
  const [hasNew, setHasNew] = useState(false);
  const { userList, fetchUserList } = useFetchUserList();
  const { createPost, createPostPending } = useCreatePost();
  const { categoriesList, fetchCategoriesList } = useFetchCategoriesList();
  let loggedId = store.getState().home.loggedUserInfo && store.getState().home.loggedUserInfo.id;
  const forceUpdate = useForceUpdate();

  useEffect(() => { store.subscribe(() => { forceUpdate(); }, [])});

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  const onFinish = values => {
    const content2 = {};
    values.content.forEach(answer => {
      content2[values.content.indexOf(answer)] = answer;
    });
    const postInfo = {
      ...values,
      creatorId: loggedId,
      numberOfPart: values.participants ? values.participants.length : 0,
      content: content2,
      endTime: values.endTime.format('x'),
    };
    createPost(postInfo)
      .then(res => {
        const newPostId = res.data.ext.create.id;
        setHasNew(true);
        message.success('Créé avec succès! 😊');
        message
          .info('Après 2s, il passera automatiquement à la page de sujet de Brainstorming.', 2)
          .then(() => props.history.push(`/post/${newPostId}`));
      })
      .catch(() => {
        message.error("L'opération a échoué. Veuillez réessayer plus tard...😭");
      });
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDate = current => {
    return current && current < moment().subtract(1, 'days');
  };

  const disabledDateTime = current => {
    if (current) {
      let today = moment().date();
      if (today === current.date()) {
        let minute = Number(moment().minutes());
        let hour = Number(moment().hour());
        let finalHour: number, finalMinute: number;
        if (current.hour() > hour) {
          finalMinute = 0;
        } else {
          if (current.minute() >= 58) {
            finalHour = hour + 1;
            finalMinute = 0;
          } else {
            finalHour = hour;
            finalMinute = minute + 5;
          }
        }
        return {
          disabledHours: () => range(0, finalHour),
          disabledMinutes: () => range(0, finalMinute),
        };
      } else if (moment() > current) {
        return {
          disabledHours: () => range(0, 24),
          disabledMinutes: () => range(0, 60),
          disabledSeconds: () => range(0, 60),
        };
      }
    } else {
      return {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60),
        disabledSeconds: () => range(0, 60),
      };
    }
  };

  const onAccessChange = value => {
    setAccess(value);
  };

  const categoryValidator = async (_, content) => {
    return (
      !content && Promise.reject(new Error('Veuillez choisir un thème pour votre brainstorming'))
    );
  };

  const contentValidator = async (_, content) => {
    if (!content || content.length < 2) {
      return Promise.reject(new Error('Au moins 2 options!'));
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  return (
    <div className="post-create-post">
      <div className="layout-left" bordered={false}>
        <div className="post-create-post-title">Créer un nouveau brainstorming</div>
        <Spin spinning={createPostPending}>
          <Form onFinish={onFinish} {...layout}>
            <Form.Item name="categoryId" rules={[{ validator: categoryValidator }]}>
              <Select
                showSearch
                allowClear
                style={{ width: 200 }}
                placeholder="Choisir un thème"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {_.map((categoriesList || []), (k, v) => {
                  return (<Option value={v} key={v}>{k}</Option>);
                })}
              </Select>
            </Form.Item>
            <Form.Item name="title">
              <Input placeholder="Titre" />
            </Form.Item>
            <Form.Item name="description">
              <TextArea placeholder="Décrivez votre brainstorming...(facultatif)" />
            </Form.Item>
            <Card title="Contenu" size="small" className="post-create-post-content">
              <Form.List name="content" rules={[{ validator: contentValidator }]}>
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item required={false} key={field.key}>
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Veuillez saisir le contenu de l'option ou supprimer cette option.",
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder={`Contenu de l'option ${String.fromCharCode(index + 65)}`}
                            style={{ width: '60%' }}
                          />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '60%' }}
                        icon={<PlusOutlined />}
                      >
                        Ajouter une option de réponse
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>

            <Form.Item
              name="endTime"
              label="Date limite"
              tooltip="La durée du sujet est d'au moins cinq minutes!"
            >
              <DatePicker
                showTime
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showNow={false}
                placeholder="Sélectionner une date"
              />
            </Form.Item>
            <Form.Item label="Permission d'accès" name="access" initialValue="public">
              <Select style={{ width: 300 }} onChange={onAccessChange}>
                <Option value="public" key="public">
                  Visible par tous
                </Option>
                <Option value="private" key="private">
                  Visible par des personnes spécifiques
                </Option>
              </Select>
            </Form.Item>
            {access === 'private' && (
              <Form.Item label="Participants" name="participants">
                {!_.isEmpty(userList) ? (
                  <Select style={{ width: 600 }} allowClear mode="multiple" listHeight={200}>
                    {userList.map(user => {
                      return (
                        <Option value={user.id} key={user.id}>
                          {user.nickname} <span className="option-normal-text">- {user.eMail}</span>
                        </Option>
                      );
                    })}
                  </Select>
                ) : (
                    <Typography.Text className="ant-form-text" type="secondary">
                      ( <SmileOutlined /> Aucun utilisateur pour le moment. )
                  </Typography.Text>
                  )}
              </Form.Item>
            )}
            <Form.Item className="post-create-post-submit" wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit">
                <SendOutlined />Publier
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
      <div className="layout-right"><PostsListByUser loggedId={loggedId} hasNew={hasNew}/></div>
    </div>
  );
}

CreatePost.propTypes = {};
CreatePost.defaultProps = {};
