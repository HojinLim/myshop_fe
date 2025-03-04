import { Content } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MenuHeader from '@/components/common/MenuHeader';
import { logout } from '@/store/slices/userSlice';
const index = () => {
  const { Title, Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    if (user && user.id) {
    } else {
      navigate('/login', { replace: 'true' });
    }
  }, [user]);

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
      <Row
        className={styles.menu_container}
        onClick={() => {
          dispatch(logout());
          navigate('/');
        }}
      >
        <Col span={24}>
          <Text>로그아웃</Text>
        </Col>
      </Row>
    </Content>
  );
};

export default index;
