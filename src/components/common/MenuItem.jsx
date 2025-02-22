import { Col } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';

export const MenuItem = (props) => {
  const { index, text, image } = props;

  return (
    <Col key={index} className="cursor-pointer text-center" span={4}>
      <img src={image} />
      <Title level={5}>{text}</Title>
    </Col>
  );
};
