import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content, Header } from 'antd/es/layout/layout';
import {
  HeartFilled,
  SearchOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Carousel,
  Col,
  Input,
  Layout,
  message,
  Row,
  Typography,
} from 'antd';
import logo from '@/assets/images/logo.png';
import { MenuItem } from '@/components/common/MenuItem';
import { getCategories } from '@/api/category';
import { getProducts } from '@/api/product';
import { discountPercent, getNonMemberId, returnBucketUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCarts, transferCart } from '@/api/cart';
import CONSTANTS from '@/constants';
import { fetchCartLength } from '@/store/slices/cartSlice';
const index = () => {
  const { Text, Title } = Typography;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [profilePic, setProfilePic] = useState(logo);
  // const [cartNum, setCartNum] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);

  const transferMyCart = async () => {
    // ✅ 장바구니 이동 (user.id가 정상적으로 업데이트된 후 실행)
    const non_user_id = localStorage.getItem(CONSTANTS.NON_MEMBER);

    if (non_user_id && user.id) {
      console.log('user.id', user.id);

      const params = { user_id: user.id, non_user_id };

      try {
        const res = await transferCart(params);
        console.log(res);
        localStorage.removeItem(CONSTANTS.NON_MEMBER);
      } catch (err) {
        message.error(err.message);
      }
    }
  };

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
          console.log(res.products);
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
    dispatch(fetchCartLength()); // ✅ 비동기 API 호출
  }, [user]);

  const { cartNum, loading, error } = useSelector((state) => state.cart);

  return (
    <Layout className={styles.layout_except_footer}>
      <Header className={styles.header}>
        <Row>
          <Col span={22}>
            <Input prefix={<SearchOutlined />} allowClear></Input>
          </Col>
          <Col span={2} className={styles.header_right}>
            <Badge count={cartNum} color="red">
              <ShoppingOutlined
                className={styles.shop_icon}
                onClick={() => {
                  navigate('/cart');
                }}
              />
            </Badge>
          </Col>
        </Row>
      </Header>

      {/* 메인 배너 */}
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
        <Row className="flex-row">
          {products.map((product) => (
            <Col
              key={product.id}
              span={12}
              className={styles.item_info}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-square overflow-hidden w-32">
                <img src={returnBucketUrl(product.ProductImages[0].imageUrl)} />
              </div>

              <Text strong>
                {discountPercent(product.originPrice, product.discountPrice)}%{' '}
                {Number(product.discountPrice).toLocaleString()}원
              </Text>
              <Text>{product.name}</Text>

              <div className="text-red-500">
                <HeartFilled />
                <span className="ml-1">1</span>
              </div>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default index;
