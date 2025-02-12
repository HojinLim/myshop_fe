import { Col, ConfigProvider, Input, Layout, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import Icon, {
  SearchOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const Landing = () => {
  const { Footer } = Layout;
  const { Title, Text } = Typography;
  const user = useSelector((state) => state.user);

  const location = useLocation();
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();

  const menuList = [
    { icon: <HomeOutlined />, text: '홈', value: '/' },
    { icon: <UnorderedListOutlined />, text: '전체보기', value: '/' },
    { icon: <SearchOutlined />, text: '검색', value: '/' },
    { icon: <UserOutlined />, text: '마이페이지', value: '/mypage' },
  ];
  console.log(user);

  const clickMenu = (id) => {
    setSelectedId(id);

    const routeName = menuList[id]['value'];

    navigate(routeName);
  };
  useEffect(() => {
    const idx = menuList.findIndex((el, idx) => el.value === location.pathname);
    setSelectedId(idx);
  }, [location.pathname]);
  useEffect(() => {
    if (user.id === '') {
      if (location.pathname === 'mypage') {
        navigate('/login');
        return;
      }
    }
  }, [user, location.pathname]);

  return (
    <>
      <Layout className={styles.layout}>
        <Outlet />

        <ConfigProvider wave={{ disabled: true }}>
          <Footer className={styles.footer}>
            <Row className="text-center">
              {menuList.map((value, index) => (
                <Col
                  className={`${styles.icon} ${
                    index === selectedId ? 'selected' : ''
                  }`}
                  span={6}
                  key={index}
                  onClick={() => clickMenu(index)}
                >
                  {value.icon}
                  <Title level={5}>{value.text}</Title>
                </Col>
              ))}
            </Row>
          </Footer>
        </ConfigProvider>
      </Layout>
    </>
  );
};

export default Landing;
