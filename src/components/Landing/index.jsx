import { Col, Input, Layout, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import Icon, {
  SearchOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  UserOutlined,
  HeartOutlined,
} from '@ant-design/icons';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const Landing = () => {
  const { Footer } = Layout;
  const { Title, Text } = Typography;
  const user = useSelector((state) => state.user.data);

  const location = useLocation();
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();

  const menuList = [
    { icon: <HomeOutlined />, text: '홈', value: '/', option: {} },
    {
      icon: <SearchOutlined />,
      text: '검색',
      value: '/search',
      option: { state: true },
    },
    {
      icon: <HeartOutlined />,
      text: '찜',
      value: '/mypage/favorite',
      option: {},
    },
    {
      icon: <UserOutlined />,
      text: '마이페이지',
      value: '/mypage',
      option: {},
    },
  ];

  const clickMenu = (index, option = {}) => {
    setSelectedId(index);

    const routeName = menuList[index]['value'];
    navigate(routeName, option);
  };
  // 주소창 path 변경마다 메뉴 인덱스 상태 변경
  useEffect(() => {
    const idx = menuList.findIndex((el, _) => el.value === location.pathname);
    setSelectedId(idx);
  }, [location.pathname]);
  useEffect(() => {
    if (!user) {
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
        <Footer className={styles.footer}>
          <Row className="text-center">
            {menuList.map((value, index) => (
              <Col
                className={`${styles.icon} ${
                  index === selectedId ? 'selected' : ''
                }`}
                span={6}
                key={index}
                onClick={() => clickMenu(index, value.option)}
              >
                {value.icon}
                <Title
                  level={5}
                  className="overflow-ellipsis whitespace-nowrap overflow-hidden"
                >
                  {value.text}
                </Title>
              </Col>
            ))}
          </Row>
        </Footer>
      </Layout>
    </>
  );
};

export default Landing;
