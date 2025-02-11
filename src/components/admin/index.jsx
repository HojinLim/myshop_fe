import React, { useEffect } from 'react';
import { Col, Layout, Menu, Row, Typography } from 'antd';
import styles from './index.module.css';
import logo from '@/assets/images/logo.png';
// import { redirect } from 'react-router-dom';

import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, redirect, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const index = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // 어드민 권한이 아닐 시 리다이렉트
  useEffect(() => {
    console.log(user);

    if ((user.role && user.role !== 'admin') || !user.role) {
      navigate('/');
    }
  }, [user]);
  const { Sider } = Layout;

  const items = [
    {
      key: 'dashboard',
      icon: <AppstoreOutlined />,
      label: '대쉬보드',
    },
    { key: 'users', icon: <UserOutlined />, label: '유저관리' },
    { key: 'settings', icon: <SettingOutlined />, label: '설정' },
  ];

  const onClick = (e) => {
    console.log('click ', e);
    if (e.key) {
      navigate(e.key);
    }
  };
  return (
    <>
      <Layout className={styles.layout}>
        <Sider className={styles.sider}>
          <Row className={styles.sider_info_container}>
            <Col span={24}>로고</Col>
            <Col span={24} className="place-items-center">
              <img src={logo} width={100} />
            </Col>
            <Col span={24}>{user.username}</Col>
          </Row>
          <Row className={styles.sider_menu_container}>
            <Col span={24}>
              <Menu
                onClick={onClick}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['1']}
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
    </>
  );
};

export default index;
