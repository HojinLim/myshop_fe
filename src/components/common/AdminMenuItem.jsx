import { Col, Flex, Input, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useRef, useState } from 'react';
import {
  CloseCircleOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import logo from '@/assets/images/logo.png';
import { returnBucketUrl } from '@/utils';

export const AdminMenuItem = (props) => {
  const { category, categories, setCategories, setUpdated, reset, setReset } =
    props;
  const [edit, setEdit] = useState(false);
  const [preview, setPreview] = useState(null);

  const imageRef = useRef(null);

  const onChangeCategory = (e) => {
    const list = categories.map((_category, _) => {
      if (_category.id === category.id) {
        return { ..._category, name: e.target.value };
      } else {
        return _category;
      }
    });
    setCategories(list);
    setUpdated(true);
    e.target.value = '';
  };

  useEffect(() => {
    updatePreviewImage();
  }, []);
  useEffect(() => {
    if (reset) {
      updatePreviewImage();
    }
  }, [reset]);
  const updatePreviewImage = () => {
    // imageUrl 없으면 기본 로고로 적용
    if (!category.imageUrl) {
      setPreview(logo);
    } else {
      const imageUrl = returnBucketUrl(category.imageUrl);

      setPreview(imageUrl);
    }

    setReset(false);
  };

  const changeCategoryImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // 이미지 미리보기

    const uploadPhotoCategory = categories.map((_category, _) => {
      if (_category.id === category.id) {
        return { ..._category, upload_photo: file };
      } else return _category;
    });
    setCategories(uploadPhotoCategory);
    e.target.value = '';
  };

  // 사진 제거 핸들러
  const removePhotoHandler = () => {
    // 이미 없는 상태면 리턴
    if (!category.imageUrl) return;
    const uploadPhotoCategory = categories.map((_category) =>
      _category.id === category.id
        ? { ..._category, upload_photo: null, photo_delete: true }
        : _category
    );

    setPreview(logo);
    setCategories([...uploadPhotoCategory]); // 새 배열로 감싸서 상태 변경 유도
  };

  return (
    <Col key={category.id} className="text-center" span={4}>
      <CloseCircleOutlined
        className="cursor-pointer right-0 absolute"
        onClick={removePhotoHandler}
      />
      <div className="aspect-square overflow-hidden w-full rounded-xl place-content-center p-2">
        <img
          src={preview}
          className="cursor-pointer w-full h-full object-fit"
          onClick={() => {
            imageRef.current.click();
          }}
        />
      </div>
      <input
        ref={imageRef}
        hidden
        type="file"
        accept="image/*"
        onChange={changeCategoryImage}
      />
      {edit ? (
        <Row>
          <Col span={18}>
            <Input value={category.name} onChange={onChangeCategory} />
          </Col>

          <Col span={6} className="place-self-center">
            <Flex vertical>
              <CheckOutlined
                className="cursor-pointer"
                onClick={() => {
                  setEdit(false);
                }}
              />
              <CloseOutlined
                className="cursor-pointer"
                onClick={() => {
                  setEdit(false);
                }}
              />
            </Flex>
          </Col>
        </Row>
      ) : (
        <Title
          level={5}
          onClick={() => {
            setEdit(true);
          }}
        >
          {category.name}
        </Title>
      )}
    </Col>
  );
};
