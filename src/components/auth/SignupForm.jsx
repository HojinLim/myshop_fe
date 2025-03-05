import React, { useEffect, useRef, useState } from 'react';
import styles from './SignupForm.module.css';
import { Content } from 'antd/es/layout/layout';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Alert,
  Row,
  Col,
  Typography,
} from 'antd';
import theme from '@/assets/styles/theme';
import FormHeader from './common/FormHeader';
import { useNavigate } from 'react-router-dom';

const back_url = import.meta.env.VITE_BACK_URL;
const SignupForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [signupForm, setForm] = useState({
    username: '',
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
  const clickRegister = async () => {
    const stringForm = JSON.stringify(signupForm);
    try {
      const response = await fetch(`${back_url}/auth/register`, {
        method: 'POST',
        body: stringForm,

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        //  에러 처리
        const errorData = await response.json();
        // alert(`회원가입 실패: ${errorData.message}`);
        setError({
          title: '회원가입 실패!',
          contents: errorData.message,
          errorOpen: true,
        });
        return;
      }

      // 성공 처리
      const data = await response.json();

      if (data) {
        alert(`회원가입 성공: ${data.user.username}`);
        navigate('/login');
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      alert('서버와의 연결에 문제가 발생했습니다.');
    }
  };
  const onChangeForm = (value, type) => {
    setForm({ ...signupForm, [type]: value });
  };

  useEffect(() => {
    // alert 사라짐 시간 조절
    if (error.errorOpen) {
      setTimeout(() => {
        setError({ title: '', contents: '', errorOpen: false });
      }, 3000);
    }
  }, [error.errorOpen]);

  // 폼 값이 변경될 때마다 유효성 검증
  const handleFormChange = () => {
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);

    setIsButtonDisabled(hasErrors);
  };

  return (
    <>
      <Content className="form_outer_container">
        <FormHeader text="이메일로 회원가입" />
        <Form
          form={form}
          className="form_container"
          {...theme.commonFormProps}
          name="basic"
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
          onFieldsChange={handleFormChange} // 폼 변경 시 유효성 검사 실행
          autoComplete="off"
        >
          <Typography.Title level={5}>닉네임</Typography.Title>
          <Form.Item
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
          <Typography.Title level={5}>이메일</Typography.Title>
          <Form.Item
            // label="이메일"
            name="email"
            rules={[
              {
                required: true,
                message: '이메일을 입력해주세요!',
              },
              {
                type: 'email',
                message: '올바른 이메일 형식을 입력해주세요!',
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
            // label="패스워드"
            name="password"
            rules={[
              {
                required: true,
                message: '패스워드를 입력해주세요!',
              },
              {
                min: 6,
                message: '비밀번호 6자리 이상 입력하세요',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Typography.Title level={5}>패스워드 확인</Typography.Title>
          <Form.Item
            // label="패스워드 확인"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: '패스워드를 입력해주세요!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('패스워드가 일치하지 않습니다!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              onChange={(e) => onChangeForm(e.target.value, 'password')}
              onPressEnter={clickRegister}
            />
          </Form.Item>

          <Form.Item
            className="place-self-end whitespace-nowrap"
            name="remember"
            valuePropName="checked"
            label={null}
          ></Form.Item>
        </Form>
        <Row>
          <Col className="text-right w-full" span={24}>
            <Button
              className="w-full"
              type="primary"
              htmlType="submit"
              onClick={clickRegister}
              disabled={isButtonDisabled} // 유효성 검사에 따라 버튼 활성화/비활성화
            >
              가입
            </Button>
            <a href="/login">로그인 바로가기</a>
          </Col>
        </Row>
      </Content>

      {error.errorOpen && (
        <Alert
          message={error.title}
          description={error.contents}
          type="error"
          closable
          banner

          // onClose={onClose}
        />
      )}
    </>
  );
};

export default SignupForm;
