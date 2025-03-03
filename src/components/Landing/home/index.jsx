import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content, Header } from 'antd/es/layout/layout';
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Carousel, Col, Input, Row, Typography } from 'antd';
import logo from '@/assets/images/logo.png';
import { MenuItem } from '@/components/common/MenuItem';
import { getCategories } from '@/api/category';
const index = () => {
  const { Text, Title } = Typography;
  const [categories, setCategories] = useState([]);

  const getCategoryList = async () => {
    await getCategories()
      .then((res) => {
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
          console.log('res.categories', res.categories);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getCategoryList();
  }, []);

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
          {categories.slice(0, 5).map((item, idx) => (
            <MenuItem key={idx} item={item} />
          ))}
          <Col span={2}></Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          {categories.slice(5, 10).map((item, idx) => (
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
