import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  Col,
  Divider,
  Flex,
  Image,
  Layout,
  Row,
  Select,
  Typography,
} from 'antd';
import MenuHeader from '../common/MenuHeader';
import { Content } from 'antd/es/layout/layout';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts } from '@/api/product';
import { discountPercent, returnBucketUrl } from '@/utils';
import NotFound from '@/components/notfound';
const index = () => {
  const { category } = useParams(); // URL에서 category 값 가져오기
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const fetchProducts = () => {
    getProducts('category', category).then((res) => {
      console.log(res);
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
      }
    });
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const clickProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <Layout className={styles.layout}>
      <MenuHeader title={category} />
      <Divider />
      <Content>
        {products.length <= 0 && (
          <NotFound
            title="제품 없음"
            subTitle="해당 카테고리 제품이 없습니다"
            // type="noBtn"
          />
        )}
        <Row className={styles.row}>
          {products.map((product) => (
            <Col key={product.id} span={12}>
              <div
                className="aspect-square overflow-hidden w-full rounded-xl place-content-center p-3 cursor-pointer"
                onClick={() => {
                  clickProduct(product.id);
                }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={
                    product?.ProductImages[0]
                      ? returnBucketUrl(product?.ProductImages[0]?.imageUrl)
                      : '/logo.png'
                  }
                />
              </div>
              <Flex>
                <p>
                  {discountPercent(product.originPrice, product.discountPrice)}%
                </p>
                <Typography.Text level={5}>
                  {Number(product.discountPrice).toLocaleString() + '원'}
                </Typography.Text>
              </Flex>
              <div>{product.name}</div>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default index;
