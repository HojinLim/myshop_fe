import React, { useEffect, useState } from 'react';
import styles from './LoginForm.module.css';
import { Content } from 'antd/es/layout/layout';
import {
  Col,
  Form,
  Row,
  Input,
  Checkbox,
  Button,
  Alert,
  Typography,
  message,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import theme from '@/assets/styles/theme';

import FormHeader from './common/FormHeader';
import { fetchUserInfo, login } from '@/store/slices/userSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  // antd 메시지 훅
  const [messageApi, contextHolder] = message.useMessage();
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

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
    const url = import.meta.env.VITE_BACK_URL || 'http://video-down.shop/api';
    try {
      const response = await fetch(
        // `${import.meta.env.VITE_BACK_URL}/auth/login`,
        `${url}/auth/login`,
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
      await messageApi
        .open({
          type: 'success',
          content: '로그인 성공 :)',
          duration: 2,
        })
        .then(() => {
          // 로그인 성공 후 유저 정보 가져오기
          dispatch(fetchUserInfo()); // 유저 정보 가져오기
          // 홈으로 이동
          navigate('/');
        })

        .catch((err) => {
          console.log(err, '네트워크 오류 발생!');
        });
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
      {contextHolder}
      <Content className="form_outer_container">
        <FormHeader text="이메일로 로그인" />
        <Form
          className="form_container"
          name="basic"
          {...theme.commonFormProps}
          labelAlign="left"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Typography.Title level={5}>이메일</Typography.Title>
          <Form.Item
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

          <Typography.Title level={5}>패스워드</Typography.Title>
          <Form.Item
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
            className="place-self-end whitespace-nowrap"
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>정보 저장</Checkbox>
          </Form.Item>
        </Form>

        <Row>
          <Col span={24}>
            <Button
              onClick={clickLogin}
              className={styles.form_bottom}
              type="primary"
              htmlType="submit"
            >
              로그인
            </Button>
          </Col>
          <a className="text-right w-full mt-3" href="/signup">
            회원가입 바로가기
          </a>
        </Row>
      </Content>
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
