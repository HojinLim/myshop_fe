import React, { useRef, useState } from 'react';
import styles from './index.module.css';

import MenuHeader from '@/components/common/MenuHeader';
import { Content } from 'antd/es/layout/layout';
import { CameraFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Row, Typography } from 'antd';

import { useSelector } from 'react-redux';
import supabase from '@/config/supabase';
import { createBucketIfNotExists } from '@/functions';
const index = () => {
  const [uploadImgUrl, setUploadImgUrl] = useState(null);
  const user = useSelector((state) => state.user);
  const bucketname = 'profileUrl';
  const clcikUpload = () => {
    photoRef.current.click();
  };
  const photoRef = useRef(null);

  // 사진 input 핸들러
  const onchangeImageUpload = async (e) => {
    const { files } = e.target;
    const uploadFile = files[0];

    // const filePath = `profiles/${user.id}/${uploadFile.name}`;

    // const { data, error } = await supabase.storage
    //   .from(bucketname)
    //   .upload(filePath, uploadFile);

    // if (error.message === 'The resource already exists') {
    //   console.log('이미 있어');
    //   return null;
    // }

    if (uploadFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // 미리보기 이미지 URL 설정
        setUploadImgUrl(reader.result);
      };

      // reader.readAsDataURL(uploadFile);
      // Use the JS library to create a bucket.

      // 프로필 버킷 생성

      await createBucketIfNotExists(bucketname);
      return;
      // return data.path; // 파일 경로 반환

      const filePath = `profiles/${user.id}/${uploadFile.name}`;

      const { data, error } = supabase.storage
        .from(bucketname)
        .upload(filePath, uploadFile, { upsert: true });

      if (error) {
        console.error('업로드 실패:', error.message);
        return null;
      }
      console.log(data);
    }
  };
  const getProfileImageUrl = async (filePath) => {
    try {
      const { data } = supabase.storage.from(bucketname).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.log(error);

      retrun;
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
