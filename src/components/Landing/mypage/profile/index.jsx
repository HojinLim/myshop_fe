import React, { useRef, useState } from 'react';
import styles from './index.module.css';

import MenuHeader from '@/components/common/MenuHeader';
import { Content } from 'antd/es/layout/layout';
import { CameraFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Row, Typography } from 'antd';

import { useSelector } from 'react-redux';

const index = () => {
  const [uploadImgUrl, setUploadImgUrl] = useState(null);
  const user = useSelector((state) => state.user.data);

  const clcikUpload = () => {
    photoRef.current.click();
  };
  const photoRef = useRef(null);

  // 사진 input 핸들러
  const onchangeImageUpload = async (e) => {
    const { files } = e.target;
    const uploadFile = files[0];

    if (uploadFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // 미리보기 이미지 URL 설정
        setUploadImgUrl(reader.result);
      };
    }
  };

  return (
    <>
      <MenuHeader title="회원 정보 수정" />
      <Content>
        <Row className="justify-self-center text-center">
          <Col span={24} className="mb-5">
            <Avatar src={uploadImgUrl} size={64} icon={<UserOutlined />} />
          </Col>
          <Col span={24}>
            <Button onClick={() => clcikUpload()}>
              <CameraFilled /> 사진 올리기
            </Button>
          </Col>
          <Col span={24} className="underline mt-1 ">
            {/* <Typography.Text>현재 사진 삭제</Typography.Text> */}
          </Col>
        </Row>
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onchangeImageUpload}
        />
      </Content>
    </>
  );
};

export default index;
