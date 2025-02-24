import { Col } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';

export const MenuItem = (props) => {
  // const { index, text, image } = props;
  const { index, category, image } = props.item;

  return (
    <Col key={index} className="cursor-pointer text-center" span={4}>
      <img src={image} />
      <Title level={5}>{category}</Title>
    </Col>
  );
};
