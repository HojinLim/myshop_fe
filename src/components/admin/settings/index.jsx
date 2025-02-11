import React from 'react';
import { Breadcrumb, Col, Row, Typography, Layout } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
const index = () => {
  const { Content } = Layout;
  const { Title } = Typography;
  return (
    <Content>
      <Title level={4}>메뉴 배치</Title>
      <Row>
        <Col span={2}></Col>
        <Col span={4}>
          <SearchOutlined></SearchOutlined>
        </Col>

        <Col span={2}></Col>
      </Row>
    </Content>
  );
};

export default index;
