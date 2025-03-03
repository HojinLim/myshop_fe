import { Col } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import logo from '@/assets/images/logo.png';
import { returnBucketUrl } from '@/functions';

export const MenuItem = (props) => {
  const { index, name: category, imageUrl } = props.item;
  const [preview, setPreview] = useState(null);

  const updatePhoto = () => {
    if (!imageUrl) {
      setPreview(logo);
    } else {
      const url = returnBucketUrl(imageUrl);
      setPreview(url);
    }
  };
  useEffect(() => {
    updatePhoto();
  }, [imageUrl]);
  return (
    <Col key={index} className="cursor-pointer text-center" span={4}>
      <img src={preview} />
      <Title level={5}>{category}</Title>
    </Col>
  );
};
