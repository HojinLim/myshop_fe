import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/store/slices/userSlice';
import MenuHeader from '@/components/common/MenuHeader';
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

  return (
    <Content>
      <MenuHeader title="마이 페이지" />

      <Row
        className={styles.menu_container}
        onClick={() => {
          navigate('/mypage/profile');
        }}
      >
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
