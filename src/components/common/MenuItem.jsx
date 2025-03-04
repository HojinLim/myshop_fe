import { Col } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import logo from '@/assets/images/logo.png';
import { returnBucketUrl } from '@/functions';
import { useNavigate } from 'react-router-dom';

export const MenuItem = (props) => {
  const { index, name: category, imageUrl } = props.item;
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const updatePhoto = () => {
    if (!imageUrl) {
      setPreview(logo);
    } else {
      const url = returnBucketUrl(imageUrl);
      setPreview(url);
    }
  };
  const clickMenu = () => {
    navigate(`/category/${category}`);
  };
  useEffect(() => {
    updatePhoto();
  }, [imageUrl]);
  return (
    <Col
      key={index}
      className="cursor-pointer text-center"
      span={4}
      onClick={clickMenu}
    >
      <img src={preview} />
      <Title level={5}>{category}</Title>
    </Col>
  );
};
