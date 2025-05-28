import { Col, Row } from 'antd';
import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';

const MenuHeader = (props) => {
  const { title, rightItems } = props;
  const navigate = useNavigate();
  return (
    <Row className="py-6 h-full">
      <Col span={4}>
        <LeftOutlined
          // 뒤로가기
          onClick={() => {
            navigate(-1);
          }}
        />
      </Col>
      <Col span={16}>
        <Title level={5} className="text-center">
          {title}
        </Title>
      </Col>
      <Col span={4}>{rightItems}</Col>
    </Row>
  );
};

export default MenuHeader;
