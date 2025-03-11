import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content, Header } from 'antd/es/layout/layout';
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Carousel, Col, Input, Row, Typography } from 'antd';
import logo from '@/assets/images/logo.png';
import { MenuItem } from '@/components/common/MenuItem';
import { getCategories } from '@/api/category';
import { getProducts } from '@/api/product';
import { returnBucketUrl } from '@/functions';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const index = () => {
  const { Text, Title } = Typography;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [profilePic, setProfilePic] = useState(logo);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const getCategoryList = async () => {
    await getCategories()
      .then((res) => {
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchProductsList = async () => {
    await getProducts()
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setProducts(res.products);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchProductsList();
    getCategoryList();
  }, []);
  useEffect(() => {
    setProfilePic(returnBucketUrl(user.profileUrl));
  }, [user]);

  const logoHandler = () => {
    if (user.id) {
      navigate('/mypage/profile');
    }
  };

  return (
    <>
      <Header className={styles.header}>
        <Row>
          <Col span={22}>
            <Input prefix={<SearchOutlined />} allowClear></Input>
          </Col>
          <Col span={2}>
            <Avatar
              className={user.id ? 'cursor-pointer' : ''}
              onClick={logoHandler}
              src={profilePic}
              onError={() => {
                setProfilePic(logo); // 기본 이미지 설정
                return false; // Ant Design 기본 동작 방지
              }}
            />
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
        {/* 카테고리 메뉴 */}
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
        {/* 전체 상품 리스트 */}
        <Row>
          {products.map((product) => (
            <Col
              key={product.id}
              span={12}
              className={styles.item_info}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img src={returnBucketUrl(product.imageUrl)} width={'50%'} />

              <Text strong>00% {product.discountPrice}</Text>
              {/* <Text strong>쇼핑몰 이름</Text> */}
              <Text>{product.name}</Text>
              <Text>00명 찜</Text>
            </Col>
          ))}
        </Row>
      </Content>
    </>
  );
};

export default index;
