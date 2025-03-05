import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { ShareAltOutlined, HeartTwoTone } from '@ant-design/icons';
import {
  Button,
  Carousel,
  Col,
  Divider,
  Drawer,
  Flex,
  Image,
  Layout,
  message,
  Row,
  Select,
  Tabs,
  Typography,
} from 'antd';
import MenuHeader from '@/components/common/MenuHeader';
import { Content, Footer } from 'antd/es/layout/layout';
import { useParams } from 'react-router-dom';
import { getProducts } from '@/api/product';
import { returnBucketUrl } from '@/functions';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/loadingSlice';
import ReviewLayout from './ReviewLayout';

const items = [
  {
    key: '1',
    label: '상품정보',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: '리뷰',
    children: <ReviewLayout />,
  },
  {
    key: '3',
    label: '문의',
    children: 'Content of Tab Pane 3',
  },
];
const index = () => {
  const { id } = useParams();
  const dispath = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
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
  const onChange = (key) => {
    console.log(key);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success('클립보드 복사 완료!');
    } catch (error) {
      message.success('복사 실패!');
    }
  };
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 비활성화
    } else {
      document.body.style.overflow = 'auto'; // 스크롤 활성화
    }

    // 컴포넌트가 unmount될 때 overflow 복원
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [drawerOpen]);

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
          {/* 상품 정보 */}
          <Col span={22}>
            <Flex vertical>
              <Typography.Text>{product.originPrice}원</Typography.Text>
              <Flex>
                <Typography.Text>50%</Typography.Text>
                <Typography.Text>{product.discountPrice}원</Typography.Text>
              </Flex>
            </Flex>
          </Col>
          {/* 클립보드 복사 */}
          <Col span={2} className="self-center text-center cursor-pointer">
            <ShareAltOutlined onClick={copyUrl} />
          </Col>
          <Divider />
          {/* 상품 정보 탭 */}
          <Col span={24}>
            <Tabs
              className={styles.tab}
              defaultActiveKey="1"
              items={items}
              onChange={onChange}
            />
          </Col>
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
            <Button onClick={() => setDrawerOpen('drawer.open')}>
              구매하기
            </Button>
          </Col>
        </Row>
      </Footer>
      {/* 상품 옵션 drawer */}
      <Content className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}>
        <Col span={24} className="mb-3">
          <Select
            // defaultValue="lucy"
            // onChange={handleChange}
            placeholder="색상 선택하기"
            options={[
              { value: 'black', label: '검정' },
              { value: 'red', label: '빨강' },
            ]}
          />
        </Col>
        <Col span={24}>
          <Select
            // defaultValue="lucy"
            // onChange={handleChange}
            placeholder="사이즈 선택하기"
            options={[
              { value: 's', label: 'S' },
              { value: 'm', label: 'M' },
              { value: 'l', label: 'L' },
            ]}
          />
        </Col>
        <Col span={24} className={styles.drawer_bottom}>
          <Divider />
          <Button onClick={() => setDrawerOpen(false)}>옵션 선택 닫기</Button>
        </Col>
      </Content>
    </Layout>
  );
};

export default index;
