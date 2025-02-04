import React, { useState } from 'react';
import styles from './SignupForm.module.css';
import { Content } from 'antd/es/layout/layout';
import { Col, Flex, Form, Row, Input, Checkbox, Button, Alert } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  if (user.id) {
    navigate('/');
  }

  const [loginForm, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    title: '',
    contents: '',
    errorOpen: false,
  });

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const clickLogin = async () => {
    const stringForm = JSON.stringify(loginForm);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/auth/login`,
        {
          method: 'POST',
          body: stringForm,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      if (!response.ok) {
        //  에러 처리
        const errorData = await response.json();
        setError({
          title: '로그인 실패!',
          contents: errorData.message,
          errorOpen: true,
        });
        return;
      }

      // 성공 처리
      const data = await response.json();
      console.log(data);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      window.location.href = '/';
      alert(`로그인 성공!!`);
    } catch (error) {
      console.error('네트워크 오류:', error);
      alert('서버와의 연결에 문제가 발생했습니다.');
    }
  };

  const onChangeForm = (value, type) => {
    setForm({ ...loginForm, [type]: value });
  };
  return (
    <>
      <Content className={styles.container}>
        <Form
          className={styles.form_container}
          name="basic"
          labelAlign="left"
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
            label="이메일"
            name="email"
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
            name="password"
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
        </Form>

        <Row style={{ width: '100%', placeContent: 'end' }}>
          <Button
            onClick={clickLogin}
            className={styles.form_bottom}
            type="primary"
            htmlType="submit"
          >
            로그인
          </Button>
        </Row>
      </Content>
      <a href="/signup">회원가입</a>
      {error.errorOpen && (
        <Alert
          message={error.title}
          description={error.contents}
          type="error"
          closable
          banner
        />
      )}
    </>
  );
};

export default LoginForm;
