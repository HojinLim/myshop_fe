import { Col } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import logo from '@/assets/images/logo.png';
import { returnBucketUrl } from '@/utils';
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
      <div className="aspect-square overflow-hidden w-full rounded-xl place-content-center p-2">
        <img src={preview} className="w-full h-full object-fit" />
      </div>
      <Title level={5}>{category}</Title>
    </Col>
  );
};
