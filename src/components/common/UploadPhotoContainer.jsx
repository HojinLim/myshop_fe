import React, { useEffect, useState } from 'react';

import { Flex } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const UploadPhotoContainer = (props) => {
  const { images, handleAddImage, handleDeleteImage, MAX_IMAGES, type } = props;

  return (
    <Flex className="photo_container">
      {/* 사진 아이템 */}
      {images.map((img, index) => (
        <div key={index} className="photo_item relative">
          <img
            src={img.url}
            className="max-h-[80%] items-center justify-self-center"
          />

          <CloseCircleOutlined
            className="cursor-pointer right-0 absolute top-0 z-20"
            onClick={() =>
              type ? handleDeleteImage(index, type) : handleDeleteImage(index)
            }
          />
        </div>
      ))}
      {/* 사진 추가 */}
      {images.length < MAX_IMAGES && (
        <label className="photo_add">
          +
          <div className="text-gray-400">
            {images.length}/{MAX_IMAGES}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImage}
          />
        </label>
      )}
    </Flex>
  );
};

export default UploadPhotoContainer;
