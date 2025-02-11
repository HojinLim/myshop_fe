import { Avatar, Button, Col, Row, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.png';

const FormHeader = (props) => {
  const { text } = props;
  const navigate = useNavigate();
  const go = (des) => {
    navigate(des);
  };
  return (
    <Row className="mb-7">
      <Col span={4} className="self-center">
        <LeftOutlined className="cursor-pointer" onClick={() => go(-1)} />
      </Col>
      <Col className="text-center" span={16}>
        <Avatar
          className="cursor-pointer"
          size="large"
          src={logo}
          onClick={() => go('/')}
        />
      </Col>
      <Col span={4}></Col>
      <Col span={24}>
        <Typography.Title level={4}>{text}</Typography.Title>
      </Col>
    </Row>
  );
};

export default FormHeader;
