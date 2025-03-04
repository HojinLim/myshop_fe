import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { ShareAltOutlined, HeartTwoTone } from '@ant-design/icons';
import {
  Button,
  Carousel,
  Col,
  Divider,
  Flex,
  Image,
  Layout,
  Row,
  Typography,
} from 'antd';
import MenuHeader from '@/components/common/MenuHeader';
import { Content, Footer } from 'antd/es/layout/layout';
import { useParams } from 'react-router-dom';
import { getProducts } from '@/api/product';
import { returnBucketUrl } from '@/functions';
import Loading from '@/components/common/Loading';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/loadingSlice';

const index = () => {
  const { id } = useParams();
  const dispath = useDispatch();
  const [product, setProduct] = useState({});
  const fetchProduct = async () => {
    await getProducts('id', id)
      .then((res) => {
        dispath(setLoading(true));
        if (res.products && res.products.length > 0) {
          setProduct(res.products[0]);
        }
      })
      .finally(() => {
        dispath(setLoading(false));
      });
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  return (
    <Layout className={styles.layout}>
      <MenuHeader title="상품정보" />
      <Content>
        <Row>
          <Col span={24}>
            {/* 슬라이더 아이템 */}
            <Carousel arrows infinite={false} adaptiveHeight>
              <Image
                width="100%"
                src={returnBucketUrl(product.imageUrl)}
                style={{ objectFit: 'contain' }}
              ></Image>
              <Image
                width="100%"
                src={returnBucketUrl(product.imageUrl)}
                style={{ objectFit: 'contain' }}
              ></Image>
            </Carousel>
          </Col>
          <Divider />
          <Col span={24}>
            <Typography.Text>{product.name}</Typography.Text>
          </Col>
          <Col span={22}>
            <Flex vertical>
              <Typography.Text>{product.originPrice}원</Typography.Text>
              <Flex>
                <Typography.Text>50%</Typography.Text>
                <Typography.Text>{product.discountPrice}원</Typography.Text>
              </Flex>
            </Flex>
          </Col>
          <Col span={2} className="self-center text-center cursor-pointer">
            <ShareAltOutlined />
          </Col>
          <Divider />
        </Row>
      </Content>
      <Footer className={styles.footer}>
        <Divider />
        <Row>
          <Col span={2}>
            <Flex vertical align="center">
              <HeartTwoTone
                className="text-center cursor-pointer"
                twoToneColor="#FF5160"
              />
              <span className="text-center">1.0만</span>
            </Flex>
          </Col>
          <Col span={22}>
            <Button>구매하기</Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default index;
