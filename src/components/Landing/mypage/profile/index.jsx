import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

import MenuHeader from '@/components/common/MenuHeader';
import { Content } from 'antd/es/layout/layout';
import { CameraFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Row, Typography } from 'antd';

import { useSelector } from 'react-redux';

const backURL = import.meta.env.VITE_BACK_URL;

const index = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const user = useSelector((state) => state.user.data);

  const clcikUpload = () => {
    photoRef.current.click();
  };
  const photoRef = useRef(null);

  // 사진 input 핸들러
  const onchangeImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // 이미지 미리보기
  };
  // 🔹 S3로 업로드하는 함수
  const handleUpload = async () => {
    if (!image) {
      alert('이미지를 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('profile', image);
    formData.append('userId', user.id);

    try {
      const response = await fetch(`${backURL}/auth/upload`, {
        body: formData,
        method: 'POST',
      });
      alert('업로드 성공!');
      if (response.data) {
        console.log('Uploaded Image URL:', response.data.imageUrl);
        return;
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 실패');
      return;
    }
  };
  const getProfileImage = async () => {
    if (user && (user.profileUrl === '' || !user.profileUrl)) return;

    const userProfile = JSON.stringify({ profileUrl: user.profileUrl });
    try {
      const response = await fetch(`${backURL}/auth/get_profile`, {
        body: userProfile,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }); // 서버에서 이미지 URL 가져오기
      const data = await response.json();

      // 서버에서 반환한 이미지 URL
      const profileUrl = data.profileUrl;

      setPreview(profileUrl);
    } catch (error) {
      console.error('프로필 이미지를 불러오는 데 실패했습니다.', error);
    }
  };
  useEffect(() => {
    console.log(user);

    getProfileImage();
  }, []);
  const deleteProfileImage = async () => {
    if (user && (user.profileUrl === '' || !user.profileUrl)) return;
    try {
      const response = await fetch(`${backURL}/auth/delete_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }), // userId를 서버로 전송
      });

      const data = await response.json();
      console.log(data.message); // "프로필 이미지가 삭제되었습니다."
      setPreview(null); // 이미지 삭제 후 미리보기 제거
      return;
    } catch (error) {
      console.error('프로필 이미지 삭제 실패:', error);
      alert('삭제 실패');
      return;
    }
  };

  return (
    <>
      <MenuHeader title="회원 정보 수정" />
      <Content>
        <Row className="justify-self-center text-center">
          <Col span={24} className="mb-5">
            <Avatar src={preview} size={64} icon={<UserOutlined />} />
          </Col>
          <Col span={24}>
            <Button onClick={() => clcikUpload()}>
              <CameraFilled /> 사진 올리기
            </Button>
            <Button onClick={() => handleUpload()}>
              <CameraFilled /> 사진 업로드
            </Button>
          </Col>
          <Col span={24} className="underline mt-1 ">
            {preview && (
              <Typography.Text
                className="cursor-pointer"
                onClick={deleteProfileImage}
              >
                현재 사진 삭제
              </Typography.Text>
            )}
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
