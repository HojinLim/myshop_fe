import React, { useState } from 'react';
import styles from './SignupForm.module.css';
import { Content } from 'antd/es/layout/layout';
import { Form, Input, Checkbox, Button } from 'antd';

const SignupForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const clickRegister = async () => {
    const stringForm = JSON.stringify(form);
    await fetch('http://127.0.0.1:5000/auth/register', {
      method: 'POST',
      body: stringForm,

      // mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      // .then((res) => {
      //   res.json();
      // })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const onChangeForm = (value, type) => {
    setForm({ ...form, [type]: value });
  };
  return (
    <>
      <Content className={styles.container}>
        <Form
          className={styles.form_container}
          on
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="이름"
            name="username"
            rules={[
              {
                required: true,
                message: '닉네임을 입력해주세요!',
              },
            ]}
          >
            <Input onChange={(e) => onChangeForm(e.target.value, 'username')} />
          </Form.Item>
          <Form.Item
            label="이메일"
            name="이메일"
            rules={[
              {
                required: true,
                message: '이메일을 입력해주세요!',
              },
            ]}
          >
            <Input
              type="email"
              onChange={(e) => onChangeForm(e.target.value, 'email')}
            />
          </Form.Item>

          <Form.Item
            label="패스워드"
            name="패스워드"
            rules={[
              {
                required: true,
                message: '패스워드를 입력해주세요!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="패스워드 확인"
            name="패스워드 확인"
            rules={[
              {
                required: true,
                message: '패스워드를 입력해주세요!',
              },
            ]}
          >
            <Input.Password
              onChange={(e) => onChangeForm(e.target.value, 'password')}
            />
          </Form.Item>

          <Form.Item
            className="place-content-end"
            name="remember"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item className={styles.form_bottom} label={null}>
            <Button type="primary" htmlType="submit" onClick={clickRegister}>
              가입
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};

export default SignupForm;
