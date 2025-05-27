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
import { returnBucketUrl } from '@/utils';
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
        <Row className={styles.row}>
          <Col span={24}>
            <Select
              defaultValue="lucy"
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
                { value: 'disabled', label: 'Disabled', disabled: true },
              ]}
            />
            <Select
              defaultValue="lucy"
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
                { value: 'disabled', label: 'Disabled', disabled: true },
              ]}
            />
          </Col>
          <Divider />
          {products.map((product) => (
            <Col key={product.id} span={12}>
              <Image
                preview={false}
                className={styles.image}
                src={returnBucketUrl(product.imageUrl)}
                onClick={() => clickProduct(product.id)}
              />
              <Flex>
                <Typography.Text>50%</Typography.Text>
                <Typography.Text level={5}>
                  {product.discountPrice}
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
