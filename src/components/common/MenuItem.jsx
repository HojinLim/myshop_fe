import { Col, Skeleton } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import logo from '@/assets/images/logo.png';
import { returnBucketUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

export const MenuItem = (props) => {
  const { index, name: category, imageUrl } = props.item;
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const updatePhoto = () => {
    if (!imageUrl) {
      setPreview(logo);
    } else {
      const url = returnBucketUrl(imageUrl);
      setPreview(url);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
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
      <div className="aspect-square overflow-hidden w-full rounded-xl place-content-center p-2 relative">
        {loading && <Skeleton.Image active className={styles.skeleton_img} />}
        <img
          src={preview}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: loading ? 0 : 1 }}
          onLoad={handleImageLoad}
        />
      </div>
      <Title level={5}>{category}</Title>
    </Col>
  );
};
