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
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Notfound from '@/components/notfound';

const index = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(true);
  const { Sider } = Layout;

  const items = [
    {
      key: 'dashboard',
      icon: <AppstoreOutlined />,
      label: '대쉬보드',
    },
    { key: 'products', icon: <ShopOutlined />, label: '상품관리' },
    { key: 'users', icon: <UserOutlined />, label: '유저관리' },
    { key: 'settings', icon: <SettingOutlined />, label: '설정' },
  ];

  const onClick = (e) => {
    if (e.key) {
      navigate(e.key);
    }
  };

  if ((!loading && !user) || user.role !== 'admin') return <Notfound />;

  return (
    <>
      {user.role === 'admin' && (
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
      )}
    </>
  );
};

export default index;
