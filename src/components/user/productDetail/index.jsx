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
import { getProducts, searchProductOption } from '@/api/product';
import { mapColors, returnBucketUrl } from '@/functions';
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
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
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
  const fetchProductOptions = async () => {
    await searchProductOption(id)
      .then((res) => {
        // 사이즈 값 적용
        if (
          Array.isArray(res.product_option) &&
          res.product_option.length > 0
        ) {
          const sizeArr = [...new Set(res.product_option.map((el) => el.size))];
          const newSizeArr = sizeArr.map((size) => ({
            value: size,
            label: size,
          }));
          setSizeOptions(newSizeArr);

          // 칼라값을 select 속성에 맞는 형태로 변환 후 적용
          const valueColorArr = [
            ...new Set(res.product_option.map((el) => el.color)),
          ];
          const labelColorArr = mapColors(valueColorArr);

          const mixedColorArr = valueColorArr.map((valueColor, idx) => ({
            value: valueColor,
            label: labelColorArr[idx],
          }));
          setColorOptions(mixedColorArr);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchProduct();
    fetchProductOptions();
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
            options={colorOptions}
          />
        </Col>
        <Col span={24}>
          <Select
            // defaultValue="lucy"
            // onChange={handleChange}
            placeholder="사이즈 선택하기"
            options={sizeOptions}
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
