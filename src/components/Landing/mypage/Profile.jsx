import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

import MenuHeader from '@/components/common/MenuHeader';
import { Content } from 'antd/es/layout/layout';
import { CameraFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, message, Row, Typography } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '@/store/slices/userSlice';
import { returnBucketUrl } from '@/utils';
import { deleteProfileImage, uploadProfileImage } from '@/api/user';

const Profile = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const user = useSelector((state) => state.user.data);

  const dispatch = useDispatch();

  const clcikUpload = () => {
    photoRef.current.click();
  };
  const photoRef = useRef(null);

  // 사진 input 핸들러
  const onchangeImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file)); // 이미지 미리보기

    await uploadProfileImage(file, user.id)
      .then(() => {
        dispatch(fetchUserInfo());
        message.success('프로필 업로드 완료');
      })
      .catch(() => {
        message.error('프로필 삭제 실패');
      })
      .finally(() => {
        e.target.value = ''; // 중복 사진 업로드 에러 방지
      });
  };

  useEffect(() => {
    if (user && user.id) {
      setPreview(returnBucketUrl(user.profileUrl));
    }
  }, [user]);

  const clickDeleteProfile = async () => {
    if (user && (user.profileUrl === '' || !user.profileUrl)) return;

    await deleteProfileImage(user.id)
      .then(() => {
        dispatch(fetchUserInfo());
        setPreview(null); // 이미지 삭제 후 미리보기 제거
        message.success('이미지 삭제 성공');
      })
      .catch(() => {
        message.error('이미지 삭제 실패');
      });
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
          </Col>
          <Col span={24} className="underline mt-1 ">
            {preview && (
              <Typography.Text
                className="cursor-pointer"
                onClick={clickDeleteProfile}
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

export default Profile;
