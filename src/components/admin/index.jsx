import React, { useEffect, useState } from 'react';
import { Col, Layout, Menu, Row } from 'antd';
import styles from './index.module.css';
import logo from '@/assets/images/logo.png';

import {
  AppstoreOutlined,
  SettingOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Notfound from '@/components/notfound';

const index = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      document.body.style.maxWidth = '100%'; // 어드민일 때 너비 제한 해제
    } else {
      document.body.style.maxWidth = '600px'; // 일반 페이지는 600px
    }

    return () => {
      document.body.style.maxWidth = ''; // 언마운트될 때 초기화
    };
  }, [isAdmin]);

  const [loading, setLoading] = useState(true);
  const [defaultMenu, setDefaultMenu] = useState('dashboard');
  const { Sider } = Layout;

  const items = [
    {
      key: 'dashboard',
      icon: <AppstoreOutlined />,
      label: '대쉬보드',
    },
    { key: 'products', icon: <ShopOutlined />, label: '상품관리' },
    { key: 'users', icon: <UserOutlined />, label: '유저관리' },
    // 설정 페이지 (예정)
    // { key: 'settings', icon: <SettingOutlined />, label: '설정' },
  ];

  const onClick = (e) => {
    if (e.key) {
      navigate(e.key);
    }
  };

  useEffect(() => {
    const filterd = location.pathname.split('/');
    const filtererPath = filterd[filterd.length - 1];

    setDefaultMenu(filtererPath);
  }, [location.pathname, location.key, defaultMenu]);

  useEffect(() => {
    if (user && user.role === 'admin' && location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, location.pathname]);

  if ((!loading && !user) || user?.role !== 'admin') {
    return <Notfound />;
  }

  return (
    <>
      {user.role === 'admin' && (
        <Layout className={styles.layout}>
          <Sider className={styles.sider}>
            <Row className={styles.sider_info_container}>
              {/* <Col span={24}>로고</Col> */}
              <Col span={24} className="place-items-center">
                <img src={logo} width={100} />
              </Col>
              <Col span={24}>{user.username}</Col>
            </Row>
            <Row className={styles.sider_menu_container}>
              <Col span={24}>
                <Menu
                  onClick={onClick}
                  defaultSelectedKeys={[defaultMenu]}
                  defaultOpenKeys={[defaultMenu]}
                  selectedKeys={[defaultMenu]}
                  mode="inline"
                  items={items}
                />
              </Col>
            </Row>
          </Sider>
          <Layout>
            <Outlet />
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default index;
