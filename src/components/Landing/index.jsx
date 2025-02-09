import { setUser } from '@/store/slices/userSlice';
import { Avatar, Button, Col, Input, Layout, Row, Typography } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import Icon, { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import logo from '@/assets/images/logo.png';
const Landing = () => {
  const { Content, Header, Footer } = Layout;
  const { Title, Text } = Typography;
  let user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem('token');
    // 초기화
    dispatch(setUser({ id: '', username: '', email: '' }));
  };

  return (
    <>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <Row>
            <Col span={23}>
              <Input prefix={<SearchOutlined />}></Input>
            </Col>
            <Col span={1}>
              <Avatar src={logo} />
            </Col>
          </Row>
        </Header>
        <Content>
          <Row className={styles.ad}>
            <Col span={24}>이거슨 광고여</Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            {Array.from({ length: 5 }).map((_, index) => (
              <Col className="cursor-pointer text-center" span={4}>
                <img src={logo} />
                <Title level={5}>신발</Title>
              </Col>
            ))}
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            {Array.from({ length: 5 }).map((_, index) => (
              <Col className="cursor-pointer text-center" span={4}>
                <img src={logo} />
                <Title level={5}>신발</Title>
              </Col>
            ))}
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={12} className={styles.item_info}>
              <img src={logo} width={'50%'} />

              <Text strong>00% 00,000</Text>
              <Text strong>쇼핑몰 이름</Text>
              <Text>제품명</Text>
              <Text>00명 찜</Text>
            </Col>
            <Col span={12} className={styles.item_info}>
              <img src={logo} width={'50%'} />

              <Text strong>00% 00,000</Text>
              <Text strong>쇼핑몰 이름</Text>
              <Text>제품명</Text>
              <Text>00명 찜</Text>
            </Col>
          </Row>
        </Content>
        <Footer className={styles.footer}>
          <Row className="text-center">
            <Col className="cursor-pointer" span={6}>
              <HomeOutlined />
              <Title level={5}>홈</Title>
            </Col>
            <Col className="cursor-pointer" span={6}>
              <HomeOutlined />
              <Title level={5}>홈</Title>
            </Col>{' '}
            <Col className="cursor-pointer" span={6}>
              <HomeOutlined />
              <Title level={5}>홈</Title>
            </Col>{' '}
            <Col className="cursor-pointer" span={6}>
              <HomeOutlined />
              <Title level={5}>홈</Title>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </>
  );
};

{
  /* <div>{user.username || '없음'}님 반가워용</div>
<button onClick={logout}>로그아웃</button>
<a href="/login">로그인</a> */
}
export default Landing;
