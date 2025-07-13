import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { Content, Header } from 'antd/es/layout/layout';
import {
  CrownOutlined,
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

import { fetchCartLength } from '@/store/slices/cartSlice';
import { setLoading } from '@/store/slices/loadingSlice';
const index = () => {
  const { Text, Title } = Typography;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [profilePic, setProfilePic] = useState(logo);
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [isFetching, setIsFetching] = useState(false);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getCategoryList = async () => {
    dispatch(setLoading(true));
    await getCategories()
      .then((res) => {
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const fetchProductsList = async () => {
    if (isFetching || !hasMore) return; // 중복 방지

    setIsFetching(true);
    dispatch(setLoading(true));

    await getProducts('', '', page)
      .then((res) => {
        if (res.products && res.products.length > 0) {
          if (res.products.length < 5) setHasMore(false);
          setProducts((prev) => [...prev, ...res.products]);
        } else {
          setHasMore(false); // 빈 배열이면 더 없음
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsFetching(false);
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    getCategoryList();
  }, []);
  useEffect(() => {
    setProfilePic(returnBucketUrl(user.profileUrl));
    dispatch(fetchCartLength()); //  비동기 API 호출
  }, [user]);

  const { cartNum, loading, error } = useSelector((state) => state.cart);

  const moveWithKeyword = () => {
    navigate(`/search/${keyword}`);
  };

  const loaderRef = useRef(null);

  useEffect(() => {
    fetchProductsList();
  }, [page]);

  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 1.0,
        rootMargin: '0px 0px 200px 0px',
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <Layout className={styles.layout_except_footer}>
      <Header className={styles.header}>
        <Row>
          {/* 검색 */}
          <Col span={22} className="px-1">
            <Input
              suffix={
                <SearchOutlined
                  className="cursor-pointer"
                  onClick={moveWithKeyword}
                />
              }
              allowClear
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={moveWithKeyword}
            ></Input>
          </Col>
          <Col span={2} className={styles.header_right}>
            <Badge count={cartNum} color="red" size="small">
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
              <div
                className={styles.ad_contaier}
                onClick={() => {
                  navigate('/admin');
                }}
              >
                <img className={styles.ad} src="/logo.png" />
              </div>
              <div
                className={styles.ad_contaier}
                onClick={() => {
                  navigate('/admin');
                }}
              >
                <img className={styles.ad} src="/logo.png" />
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
                <img
                  className="h-full w-full object-cover"
                  src={
                    product?.ProductImages?.find((img) => img.type === 'main')
                      ? returnBucketUrl(
                          product.ProductImages.find(
                            (img) => img.type === 'main'
                          ).imageUrl
                        )
                      : '/logo.png'
                  }
                />
              </div>

              <Text strong>
                {discountPercent(product.originPrice, product.discountPrice)}%{' '}
                {Number(product.discountPrice).toLocaleString()}원
              </Text>
              <Text>{product.name}</Text>

              <div className="text-red-400">
                <HeartFilled />
                <span className="ml-1">{product.favorites.length}</span>
              </div>
            </Col>
          ))}
          {/* 다음 스크롤 감시 불러올 지점 */}
          {hasMore && products.length > 0 && <div ref={loaderRef}></div>}
        </Row>
      </Content>
    </Layout>
  );
};

export default index;
