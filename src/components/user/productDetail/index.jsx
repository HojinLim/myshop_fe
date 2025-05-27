import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  ShareAltOutlined,
  HeartTwoTone,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Carousel,
  Col,
  Divider,
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
import { getProducts, getProductOption } from '@/api/product';
import { mapColors, returnBucketUrl, getNonMemberId } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/store/slices/loadingSlice';
import ReviewLayout from './ReviewLayout';
import ProductSelectItem from './ProductSelectItem';
import { addCart, updateCartOption } from '@/api/cart';

const index = () => {
  const { id } = useParams();
  const dispath = useDispatch();
  const user = useSelector((state) => state.user.data);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    color: null,
    size: null,
  });
  const [cart, setCart] = useState([]);

  // color: null,
  // size: null,
  // price: "",
  // quantity: 0,
  const [selectMode, setSelectMode] = useState(true);

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
    await getProductOption(id)
      .then((res) => {
        // 사이즈 값 적용
        if (
          Array.isArray(res.product_option) &&
          res.product_option.length > 0
        ) {
          // 전체값 적용
          setOptions(res.product_option);

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

  const DetailProductLayout = ({ product }) => {
    return (
      <div>
        {product.ProductImages &&
          Array.isArray(product.ProductImages) &&
          product.ProductImages.filter((image) => image.type === 'detail').map(
            (item, key) => (
              <Image
                key={key}
                width="100%"
                height={'30vh'}
                preview={false}
                src={returnBucketUrl(item.imageUrl)}
                style={{ objectFit: 'contain' }}
              />
            )
          )}
      </div>
    );
  };
  const items = [
    {
      key: '1',
      label: '상품정보',
      children: <DetailProductLayout product={product} />,
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
  const handleColorChange = (value) => {
    const sizeArr = options
      .filter((el) => el.color === value)
      .map((item) => ({
        value: item.size,
        label: (
          <span className="flex justify-between items-center">
            <div className="flex flex-col ">
              <span>{item.size}</span>
              {/* stock이 0이면 품절 */}
              <span>{item.stock <= 0 ? '품절' : ''}</span>
            </div>
            <span>{item.price}원</span>
          </span>
        ),
        disabled: item.stock <= 0 ? true : false,
      }));

    setSelectedOption({ color: value, size: null }); // ✅ `null`로 설정하여 placeholder 유지
    setSizeOptions(sizeArr);
  };

  const handleSizeChange = (value) => {
    setSelectedOption((prev) => ({ ...prev, size: value }));
    handleAddToCart(selectedOption.color, value);

    setSelectedOption({ color: null, size: null });
    setSelectMode(false);
  };

  const handleAddToCart = (color, size) => {
    const selectedProduct = options.find(
      (item) => item.color === color && item.size === size
    );

    if (!selectedProduct) return; // ✅ 선택한 옵션이 없으면 종료

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.color === color && item.size === size
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...selectedProduct, quantity: 1 }];
    });
  };
  const handleQuantityChange = (color, size, type) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.color === color && item.size === size
          ? {
              ...item,
              quantity:
                type === 'increase'
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };
  const deleteFromCart = (color, size) => {
    const selectedProduct = options.find(
      (item) => item.color === color && item.size === size
    );

    if (!selectedProduct) return; // ✅ 선택한 옵션이 없으면 종료

    setCart((prevCart) => {
      return prevCart.filter(
        (item) => !(item.color === color && item.size === size)
      );
    });
  };
  // 장바구니 담기 클릭 후
  const clickAddToCart = async () => {
    if (!cart || cart.length <= 0) return;

    try {
      const promises = cart.map(async (item) => {
        let params = {
          user_id: user.id || getNonMemberId(),
          product_option_id: item.id,
          quantity: item.quantity,
        };

        try {
          await addCart(params);
        } catch (err) {
          console.log(err);
          message.error(err.message);
        }
      });

      await Promise.all(promises); // ✅ 모든 요청을 병렬 처리!
      message.success('모든 상품이 성공적으로 장바구니에 추가됨!');
      // 장바구니 초기화
      setCart([]);

      // Drawer닫기
      setDrawerOpen(false);
    } catch (error) {
      console.error('❌ 장바구니 추가 중 오류 발생:', error);
    }
  };

  // 총 가격
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  console.log(cart);

  // 총 수량
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <Layout className={styles.layout}>
      <MenuHeader title="상품정보" />
      <Content style={{ height: '80%' }}>
        <Row>
          <Col span={24}>
            {/* 슬라이더 아이템 */}상품정보
            <Carousel arrows infinite={false} adaptiveHeight>
              {product.ProductImages &&
                Array.isArray(product.ProductImages) &&
                product.ProductImages.map((item, key) => (
                  <Image
                    key={key}
                    width="100%"
                    height="30vh"
                    src={returnBucketUrl(item.imageUrl)}
                    style={{ objectFit: 'contain' }}
                  />
                ))}
            </Carousel>
          </Col>
          <Divider />
          <Col span={24}>
            <Typography.Text>{product.name}</Typography.Text>
          </Col>
          {/* 상품 정보 */}
          <Col span={22}>
            <Flex vertical>
              <Typography.Text className="line-through">
                {product.originPrice}원
              </Typography.Text>
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
        {/* 선택 모드 */}
        {selectMode ? (
          <>
            <Col span={24} className="mb-3">
              <Select
                onChange={handleColorChange}
                placeholder="색상 선택하기"
                options={colorOptions}
                // value={selectedOption.color}
              />
            </Col>
            <Col span={24}>
              <Select
                onChange={handleSizeChange}
                placeholder="사이즈 선택하기"
                options={sizeOptions}
                value={selectedOption.size} // ✅ 실제 선택된 값 반영
              />
            </Col>
          </>
        ) : (
          <>
            <Button
              className={styles.select_drawer_button}
              onClick={() => {
                setSelectMode(true);
              }}
            >
              옵션 선택하기
            </Button>

            {/* 선택한 상품 목록- 카트 */}
            {cart.map((item, idx) => (
              <ProductSelectItem
                key={idx}
                product={item}
                deleteFromCart={deleteFromCart}
                handleQuantityChange={handleQuantityChange}
              />
            ))}
          </>
        )}

        {/* 드로어 footer */}
        <Col span={24} className={styles.drawer_footer}>
          <Divider />
          {selectMode ? (
            <Button
              className="w-full"
              onClick={() => {
                setDrawerOpen(false);
                setSelectMode(false);
              }}
            >
              옵션 선택 닫기
            </Button>
          ) : (
            <>
              <Flex className="justify-between">
                <span className="text-lg">{totalQuantity}개 선택</span>
                <div>
                  <span className="text-lg">총</span>
                  <span className="text-lg font-bold text-red-500">
                    {Number(totalPrice).toLocaleString()}원
                  </span>
                </div>
              </Flex>
              <Divider />
              <Flex className="gap-3">
                <Button
                  className="w-full"
                  disabled={cart.length <= 0}
                  onClick={clickAddToCart}
                >
                  장바구니
                </Button>
                <Button className="w-full" disabled={cart.length <= 0}>
                  구매하기
                </Button>
              </Flex>
            </>
          )}
        </Col>
      </Content>
    </Layout>
  );
};

export default index;
