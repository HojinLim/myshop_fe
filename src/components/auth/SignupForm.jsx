import React, { useEffect, useRef, useState } from 'react';
import styles from './SignupForm.module.css';
import { Content } from 'antd/es/layout/layout';
import { Form, Input, Checkbox, Button, Alert } from 'antd';

const SignupForm = () => {
  const [form] = Form.useForm();
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
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
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
      alert(`회원가입 성공: ${data.user.username}`);
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
      <Content className={styles.container}>
        <Form
          form={form}
          className={styles.form_container}
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
          onFieldsChange={handleFormChange} // 폼 변경 시 유효성 검사 실행
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

          <Form.Item
            label="패스워드"
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
          <Form.Item
            label="패스워드 확인"
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
          <a href="/login">로그인</a>
          <Form.Item name="test" className={styles.form_bottom} label={null}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={clickRegister}
              disabled={isButtonDisabled} // 유효성 검사에 따라 버튼 활성화/비활성화
            >
              가입
            </Button>
          </Form.Item>
        </Form>
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
