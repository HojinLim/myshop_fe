import React from 'react';
import styles from './index.module.css';
import { Content, Header } from 'antd/es/layout/layout';
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Carousel, Col, Input, Row, Typography } from 'antd';
import logo from '@/assets/images/logo.png';
import { MenuItem } from '@/components/common/MenuItem';
const index = () => {
  const { Text, Title } = Typography;
  const productList = [
    { index: 1, image: logo, category: '전체' },
    { index: 2, image: logo, category: '신발' },
    { index: 3, image: logo, category: '양말' },
    { index: 4, image: logo, category: '상의' },
    { index: 5, image: logo, category: '하의' },
    { index: 6, image: logo, category: '아우터' },
    { index: 7, image: logo, category: '악세사리' },
    { index: 8, image: logo, category: '반지' },
    { index: 9, image: logo, category: '주얼리' },
    { index: 10, image: logo, category: 'etc' },
  ];

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
          {productList.slice(0, 5).map((item, idx) => (
            <MenuItem key={idx} item={item} />
          ))}
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          {productList.slice(5, 10).map((item, idx) => (
            <MenuItem key={idx} item={item} />
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
