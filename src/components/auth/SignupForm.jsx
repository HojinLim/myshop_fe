import React from 'react';
import styles from './SignupForm.module.css';
import { Content } from 'antd/es/layout/layout';
import { Col, Flex, Form, Row, Input, Checkbox, Button } from 'antd';

const SignupForm = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Content className={styles.container}>
        <Form
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
          autoComplete="off"
        >
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
            <Input type="email" />
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
            <Input.Password />
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
            <Button type="primary" htmlType="submit">
              가입
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};

export default SignupForm;
