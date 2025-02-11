import React from 'react';
import styles from './index.module.css';
import { Content, Header } from 'antd/es/layout/layout';
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Carousel, Col, Input, Row, Typography } from 'antd';
import logo from '@/assets/images/logo.png';
const index = () => {
  const { Text, Title } = Typography;
  return (
    <>
      <Header className={styles.header}>
        <Row>
          <Col span={22}>
            <Input prefix={<SearchOutlined />} allowClear></Input>
          </Col>
          <Col span={2}>
            <Avatar src={logo} />
          </Col>
        </Row>
      </Header>

      <Content>
        <Row>
          <Col span={24}>
            <Carousel arrows infinite>
              <div className={styles.ad_contaier}>
                <img className={styles.ad} src={logo} />
              </div>
              <div className={styles.ad_contaier}>
                <img className={styles.ad} src={logo} />
              </div>
              <div className={styles.ad_contaier}>
                <img className={styles.ad} src={logo} />
              </div>
              <div className={styles.ad_contaier}>
                <img className={styles.ad} src={logo} />
              </div>
            </Carousel>
          </Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          {Array.from({ length: 5 }).map((_, index) => (
            <Col className="cursor-pointer text-center" key={index} span={4}>
              <img src={logo} />
              <Title level={5}>신발</Title>
            </Col>
          ))}
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          {Array.from({ length: 5 }).map((_, index) => (
            <Col key={index} className="cursor-pointer text-center" span={4}>
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
    </>
  );
};

export default index;
