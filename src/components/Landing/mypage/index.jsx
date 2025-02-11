import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/store/slices/userSlice';
const index = () => {
  const { Title, Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const logout = () => {
    localStorage.removeItem('token');
    // 초기화
    dispatch(setUser({ id: '', username: '', email: '', role: '' }));
    navigate('/');
  };
  if (user.id === '') {
    navigate('/login');
    return;
  }
  return (
    <Content>
      <Row className="py-6">
        <Col className="icon" span={4}>
          <LeftOutlined />
        </Col>
        <Col span={16}>
          <Title level={5} className="text-center">
            마이페이지
          </Title>
        </Col>
        <Col span={2}></Col>
      </Row>
      <Row className={styles.menu_container}>
        <Col span={22}>
          <Text>회원 정보 수정</Text>
        </Col>
        <Col span={2}>
          <RightOutlined />
        </Col>
      </Row>
      <Row className={styles.menu_container} onClick={logout}>
        <Col span={24}>
          <Text>로그아웃</Text>
        </Col>
      </Row>
    </Content>
  );
};

export default index;
