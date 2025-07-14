import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  ShareAltOutlined,
  CloseOutlined,
  ShoppingOutlined,
  HomeOutlined,
  HeartFilled,
  HeartOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Carousel,
  Col,
  Divider,
  Flex,
  Layout,
  message,
  Row,
  Select,
  Tabs,
  Typography,
} from 'antd';
import MenuHeader from '@/components/common/MenuHeader';
import { Content, Footer } from 'antd/es/layout/layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts, getProductOption } from '@/api/product';
import {
  mapColors,
  returnBucketUrl,
  getNonMemberId,
  toWon,
  discountPercent,
} from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/store/slices/loadingSlice';
import ReviewLayout from './ReviewLayout';
import ProductSelectItem from './ProductSelectItem';
import { addCart } from '@/api/cart';
import { fetchCartLength } from '@/store/slices/cartSlice';
import {
  checkFavorite,
  countProductFavorite,
  createFavorite,
  deleteFavorite,
} from '@/api/favorite';
import { getProductReviews } from '@/api/review';

const Index = () => {
  const { pathname } = useLocation();
  // URL에서 상품 ID를 추출합니다.
  const id = pathname.split('/').pop();

  const dispatch = useDispatch();
  // Redux store에서 사용자 정보를 가져옵니다.
  const user = useSelector((state) => state.user.data);

  // 상태 변수들을 정의합니다.
  const [drawerOpen, setDrawerOpen] = useState(false); // 상품 옵션 드로어 열림/닫힘 상태
  const [product, setProduct] = useState({}); // 현재 상품 정보
  const [colorOptions, setColorOptions] = useState([]); // 색상 옵션 목록
  const [sizeOptions, setSizeOptions] = useState([]); // 사이즈 옵션 목록
  const [options, setOptions] = useState([]); // 모든 상품 옵션 (색상, 사이즈 조합)
  const [selectedOption, setSelectedOption] = useState({
    // 현재 선택된 옵션
    color: null,
    size: null,
  });
  const [cart, setCart] = useState([]); // 드로어 내에서 임시로 관리되는 장바구니 상품 목록
  const [productLikeCount, setProductLikeCount] = useState(0); // 상품 좋아요 수
  const [productLike, setProductLike] = useState(false); // 현재 사용자의 상품 좋아요 여부
  const [optionBtnVisible, setOptionBtnVisible] = useState(true); // 옵션 선택 버튼 가시성

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  const [selectMode, setSelectMode] = useState(true); // 옵션 선택 모드 (색상/사이즈 선택 vs 선택된 상품 목록)

  // 상품 정보를 가져오는 비동기 함수 (상품 데이터를 반환하도록 수정)
  const fetchProduct = async () => {
    dispatch(setLoading(true)); // 로딩 상태 시작
    try {
      const res = await getProducts('id', id); // API 호출로 상품 정보 가져오기
      if (res.products && res.products.length > 0) {
        const fetchedProduct = res.products[0];
        setProduct(fetchedProduct);

        // 상품의 좋아요 수 가져오기
        const likeCountRes = await countProductFavorite(id);
        setProductLikeCount(likeCountRes.count);

        // 현재 사용자의 좋아요 여부 확인
        const checkFavoriteRes = await checkFavorite(user.id, id);
        setProductLike(checkFavoriteRes.isFavorite);

        return fetchedProduct; // 중요: 가져온 상품 데이터를 반환
      }
      return null; // 상품이 없으면 null 반환
    } catch (err) {
      console.error('상품 정보를 가져오는 중 오류 발생:', err);
      message.error('상품 정보를 불러오는 데 실패했습니다.');
      return null;
    } finally {
      dispatch(setLoading(false)); // 로딩 상태 종료
    }
  };

  // 상품 좋아요 클릭 핸들러
  const clickProductLike = async () => {
    if (!user.id) {
      // 로그인 여부 확인
      message.warning('로그인 후 이용 가능합니다.');
      return;
    }
    try {
      if (productLike) {
        // 좋아요 취소
        await deleteFavorite(user.id, id);
        setProductLike(false);
        message.success('좋아요가 취소되었습니다.');
      } else {
        // 좋아요 추가
        await createFavorite(user.id, id);
        setProductLike(true);
        message.success('상품을 좋아합니다!');
      }
      // 좋아요 수 다시 불러오기
      const likeCountRes = await countProductFavorite(id);
      setProductLikeCount(likeCountRes.count);
    } catch (err) {
      console.error('좋아요 처리 중 오류 발생:', err);
      message.error('좋아요 처리 중 문제가 발생했습니다.');
    }
  };

  // 상품 옵션 정보를 가져오는 비동기 함수 (fetchedProduct를 인자로 받도록 수정)
  const fetchProductOptions = async (fetchedProduct) => {
    // <-- 인자 추가
    try {
      const res = await getProductOption(id); // API 호출로 상품 옵션 정보 가져오기
      if (Array.isArray(res.product_option) && res.product_option.length > 0) {
        setOptions(res.product_option);

        const valueColorArr = [
          ...new Set(res.product_option.map((el) => el.color)),
        ];
        const labelColorArr = mapColors(valueColorArr);

        const mixedColorArr = valueColorArr.map((valueColor, idx) => ({
          value: valueColor,
          label: labelColorArr[idx],
        }));
        setColorOptions(mixedColorArr);
      } else {
        // 옵션이 없으면
        setSelectMode(false);
        setOptionBtnVisible(false);

        // fetchedProduct가 유효한지 확인 후 defaultItem 설정
        if (fetchedProduct && fetchedProduct.id) {
          // <-- 인자로 받은 fetchedProduct 사용
          const defaultItem = {
            id: null,
            price: fetchedProduct.discountPrice,
            product_id: fetchedProduct.id,
            quantity: 1,
            color: null,
            size: null,
            imageUrl: fetchedProduct.ProductImages[0].imageUrl,
          };

          setCart([defaultItem]);
        } else {
          console.warn(
            '옵션이 없는 상품이지만, 상품 정보가 유효하지 않습니다.'
          );
        }
      }
    } catch (err) {
      console.error('상품 옵션 정보를 가져오는 중 오류 발생:', err);
      message.error('상품 옵션을 불러오는 데 실패했습니다.');
    }
  };

  // 해당 상품 리뷰 리스트 불러오기 로직
  const [reviews, setReviews] = useState({ averageRating: 0, reviews: [] });

  // 리뷰 사진 배열
  const [reviewPhotos, setReivePhotos] = useState([]);
  // 리뷰 사진과 그와 연관된 리뷰를 포함한 배열
  const [combinedReviewPhotos, setCombinedReviewPhotos] = useState([]);

  // 리뷰 정보를 가져오는 함수는 ID만 필요하므로 독립적으로 유지
  const fetchReview = async () => {
    try {
      const res = await getProductReviews(user.id, id);
      setReviews(res);

      const reviewPhotos = res?.reviews?.flatMap(
        (review) => review.review_images
      );
      // 단일 리뷰 사진 배열
      setReivePhotos(reviewPhotos);

      // 리뷰 사진과 그와 연관된 리뷰를 포함한 배열
      const combinedReviewPhotos = reviewPhotos.map((photo) => {
        const matchedReview = res?.reviews.find(
          (review) => review.id === photo.review_id
        );
        return {
          ...photo,
          review: matchedReview,
        };
      });
      setCombinedReviewPhotos(combinedReviewPhotos);
    } catch (err) {
      console.error('리뷰 정보를 가져오는 중 오류 발생:', err);
      // 에러 처리: 메시지 표시 등
    }
  };

  // 이 useEffect에서 모든 데이터를 비동기적으로 가져옵니다.
  useEffect(() => {
    const fetchAllData = async () => {
      // 1. 상품 정보를 먼저 가져옵니다. (await를 사용하여 완료될 때까지 기다림)
      const fetchedProduct = await fetchProduct(); // 상품 데이터를 받아옴

      // 2. 상품 정보가 성공적으로 가져와졌다면, 그 정보를 바탕으로 옵션 정보를 가져옵니다.
      if (fetchedProduct) {
        await fetchProductOptions(fetchedProduct); // 받아온 상품 데이터를 인자로 전달
      }

      // 3. 리뷰 정보는 상품 정보와 독립적으로 가져올 수 있으므로 별도로 호출합니다.
      await fetchReview();
    };

    fetchAllData(); // 모든 데이터 가져오기 함수 호출
  }, [id, user.id]); // 의존성 배열에 id와 user.id를 추가

  const DetailProductLayout = ({ product }) => {
    return (
      <div className="w-full">
        {product.ProductImages &&
          Array.isArray(product.ProductImages) &&
          product.ProductImages.filter((image) => image.type === 'detail').map(
            (item, key) => (
              <img
                className="w-full h-full object-contain"
                key={key}
                src={returnBucketUrl(item.imageUrl)}
                alt={`상품 상세 이미지 ${key + 1}`}
              />
            )
          )}
        {(!product.ProductImages ||
          product.ProductImages.filter((image) => image.type === 'detail')
            .length <= 0) && (
          <img
            className="w-full h-full object-cover"
            src="https://placehold.co/600x1200/cccccc/333333?text=No+Detail+Image" // 기본 이미지 변경
            alt="상세 이미지 없음"
          />
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
      label: `리뷰 ${reviews?.reviews?.length || 0}`, // 리뷰 개수 없을 시 0 표시
      children: (
        <ReviewLayout
          productId={id}
          reviews={reviews}
          fetchReview={fetchReview}
          reviewPhotos={reviewPhotos}
          combinedReviewPhotos={combinedReviewPhotos}
        />
      ),
    },
  ];

  const onChange = (key) => {};

  // 현재 URL을 클립보드에 복사하는 함수
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success('클립보드 복사 완료!');
    } catch (error) {
      message.error('복사 실패!');
      console.error('클립보드 복사 오류:', error);
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

  // 색상 선택 변경 핸들러
  const handleColorChange = (value) => {
    // 선택된 색상에 해당하는 사이즈 옵션들을 필터링
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
            <span>{toWon(item.price)}원</span>
          </span>
        ),
        disabled: item.stock <= 0, // 재고가 없으면 비활성화
      }));

    setSelectedOption({ color: value, size: null }); // `null`로 설정하여 placeholder 유지
    setSizeOptions(sizeArr); // 사이즈 옵션 업데이트
  };

  // 사이즈 선택 변경 핸들러
  const handleSizeChange = (value) => {
    handleAddToCart(selectedOption.color, value); // 색상과 사이즈로 카트에 추가
    setSelectedOption({ color: null, size: null }); // 선택 완료 후 초기화
    setSelectMode(false); // 선택 모드 해제
  };

  // 상품을 장바구니에 추가하는 함수 (드로어 내 임시 장바구니)
  const handleAddToCart = (color, size) => {
    const selectedProduct = options.find(
      (item) => item.color === color && item.size === size
    );

    if (!selectedProduct) {
      message.warning('선택된 옵션에 해당하는 상품이 없습니다.');
      return; // 선택한 옵션이 없으면 종료
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.color === color && item.size === size
      );

      if (existingItem) {
        // 이미 장바구니에 있는 상품이면 수량만 증가
        return prevCart.map((item) =>
          item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // 새로운 상품이면 장바구니에 추가
      return [
        ...prevCart,
        {
          ...selectedProduct,
          quantity: 1,
          product_id: product.id,
          imageUrl: product.ProductImages[0].imageUrl,
        },
      ]; // product_id 추가
    });
  };

  // 장바구니 상품 수량 변경 핸들러
  const handleQuantityChange = (color, size, type) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.color === color && item.size === size
          ? {
              ...item,
              quantity:
                type === 'increase'
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1), // 수량 감소 (최소 1)
            }
          : item
      )
    );
  };

  // 장바구니에서 상품 삭제 핸들러
  const deleteFromCart = (color, size) => {
    setCart((prevCart) => {
      return prevCart.filter(
        (item) => !(item.color === color && item.size === size)
      );
    });
  };

  // '장바구니 담기' 버튼 클릭 후 실제 장바구니 API 호출
  const clickAddToCart = async () => {
    if (!cart || cart.length <= 0) {
      message.warning('장바구니에 담을 상품이 없습니다.');
      return;
    }

    try {
      // 각 상품을 병렬로 장바구니에 추가
      const promises = cart.map(async (item) => {
        const isOptionProduct = !!(item.color || item.size); // 옵션이 있는 상품인지 체크 (색상이나 사이즈가 있으면 옵션 상품)

        let params = {
          user_id: user.id || getNonMemberId(), // 로그인 사용자 ID 또는 비회원 ID
          product_option_id: isOptionProduct ? item.id : null, // 옵션 상품 ID
          product_id: item.product_id || product.id, // 옵션이 없어도 product.id 사용
          quantity: item.quantity, // 수량
        };

        await addCart(params); // 장바구니 추가 API 호출
      });

      await Promise.all(promises); // 모든 병렬 요청이 완료될 때까지 기다림
      message.success('모든 상품이 성공적으로 장바구니에 추가됨!');
      setCart([]); // 임시 장바구니 초기화
      setDrawerOpen(false); // 드로어 닫기
      dispatch(fetchCartLength()); // Redux 장바구니 길이 업데이트
    } catch (error) {
      console.error('장바구니 추가 중 오류 발생:', error);
      message.error('장바구니 추가 중 오류가 발생했습니다.');
    }
  };

  // 총 가격 계산
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Redux에서 장바구니 개수 정보 가져오기 (비동기 처리)
  const { cartNum } = useSelector((state) => state.cart); // loading, error 제거 (사용되지 않음)
  useEffect(() => {
    dispatch(fetchCartLength()); // 컴포넌트 마운트 시 장바구니 길이 가져오기
  }, [dispatch]);

  // 헤더에 표시될 우측 아이템들
  const RightItems = () => {
    return (
      <>
        <HomeOutlined
          className="text-xl mr-2 cursor-pointer"
          onClick={() => {
            navigate('/'); // 홈으로 이동
          }}
        />
        <Badge count={cartNum} color="red">
          <ShoppingOutlined
            className="text-xl cursor-pointer"
            onClick={() => {
              navigate('/cart'); // 장바구니 페이지로 이동
            }}
          />
        </Badge>
      </>
    );
  };

  // '구매하기' 버튼 클릭 핸들러
  const clickBuyHandler = () => {
    if (cart.length <= 0) {
      message.warning('구매할 상품이 없습니다.');
      return;
    }
    navigate('/payment', { state: cart }); // 결제 페이지로 이동하며 선택된 상품 목록 전달
  };

  // 총 수량 계산
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Layout className={styles.layout}>
      <div>
        {/* 상단 메뉴 헤더 */}
        <MenuHeader title="상품정보" rightItems={RightItems()} />
      </div>
      <Content>
        <Row>
          <Col span={24}>
            {/* 상품 메인 이미지 슬라이더 */}
            <Carousel arrows infinite={false} adaptiveHeight>
              {product.ProductImages &&
                Array.isArray(product.ProductImages) &&
                product.ProductImages.filter(
                  (item) => item.type === 'main'
                ).map((item, key) => (
                  <div
                    key={key}
                    className="aspect-square overflow-hidden w-full h-64" // 높이 조정
                  >
                    <img
                      src={returnBucketUrl(item.imageUrl)}
                      className="w-full h-full object-contain"
                      alt={`상품 메인 이미지 ${key + 1}`}
                    />
                  </div>
                ))}
              {(!product.ProductImages ||
                product.ProductImages.filter((image) => image.type === 'main')
                  .length <= 0) && (
                <div className="aspect-square overflow-hidden w-full h-64">
                  <img
                    className="w-full h-full object-cover"
                    src="https://placehold.co/600x600/cccccc/333333?text=No+Main+Image"
                    alt="메인 이미지 없음"
                  />
                </div>
              )}
            </Carousel>
          </Col>
          <Divider className="my-4" />
          <Col span={24} className="px-4">
            <Typography.Title level={3} className="mb-2">
              {product.name}
            </Typography.Title>
          </Col>
          {/* 상품 정보 */}
          <Col span={22} className="px-4">
            <Flex vertical>
              <p className="line-through text-lg text-gray-400 mb-1">
                {toWon(product.originPrice)}원
              </p>
              <Flex align="center">
                <p className="mr-2 font-bold text-xl text-red-500">
                  {discountPercent(product.originPrice, product.discountPrice)}%
                </p>
                <p className="font-bold text-xl">
                  {toWon(product.discountPrice)}원
                </p>
              </Flex>
            </Flex>
          </Col>
          {/* 클립보드 복사 */}
          <Col span={2} className="self-center text-center cursor-pointer">
            <ShareAltOutlined
              className="text-2xl text-gray-600 hover:text-blue-500 transition-colors"
              onClick={copyUrl}
            />
          </Col>
          <Divider className="my-4" />
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
        <Row className="h-full items-center w-full">
          <Col span={2} className="flex justify-center items-center">
            <Flex vertical align="center" className="items-center text-center">
              <div
                className="text-red-500 cursor-pointer text-2xl hover:scale-110 transition-transform"
                onClick={clickProductLike}
              >
                {productLike ? <HeartFilled /> : <HeartOutlined />}
              </div>
              <p className="text-sm text-gray-600 mt-1">{productLikeCount}</p>
            </Flex>
          </Col>
          <Col span={22}>
            <Button
              type="primary"
              size="large"
              className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={() => setDrawerOpen(true)}
            >
              구매하기
            </Button>
          </Col>
        </Row>
      </Footer>
      {/* 상품 옵션 drawer */}
      <Content className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}>
        {/* 드로어 헤더 */}
        {!optionBtnVisible && (
          <>
            <div className={styles.drawerHeader}>
              <Button
                className="w-full rounded-lg !font-bold !h-14"
                size="large"
                onClick={() => {
                  setDrawerOpen(false);
                }}
              >
                상품 선택 닫기
              </Button>
            </div>
          </>
        )}

        {/* 선택 모드 */}
        {selectMode ? (
          <div className="p-4">
            <Col span={24} className="mb-3">
              <Select
                className="w-full rounded-md"
                onChange={handleColorChange}
                placeholder="색상 선택하기"
                options={colorOptions}
                value={selectedOption.color}
              />
            </Col>
            <Col span={24}>
              <Select
                className="w-full rounded-md"
                onChange={handleSizeChange}
                placeholder="사이즈 선택하기"
                options={sizeOptions}
                value={selectedOption.size}
                disabled={!selectedOption.color} // 색상이 선택되어야 사이즈 선택 가능
              />
            </Col>
          </div>
        ) : (
          <>
            {optionBtnVisible && (
              <Button
                className={`${styles.select_drawer_button} w-full rounded-lg mb-4`}
                onClick={() => {
                  setSelectMode(true);
                  setSelectedOption({ color: null, size: null });
                }}
              >
                옵션 선택하기
              </Button>
            )}

            {/* 선택한 상품 목록- 카트 */}
            <div className="flex-grow overflow-y-auto p-4">
              {/* 스크롤 가능하도록 flex-grow 추가 */}
              {cart.length === 0 &&
                !optionBtnVisible && ( // 옵션이 없는데 카트도 비어있으면 메시지
                  <div className="text-center text-gray-500 py-8">
                    옵션이 없는 상품입니다.
                  </div>
                )}
              {cart.map((item, idx) => (
                <ProductSelectItem
                  key={idx}
                  product={item}
                  productInfo={product}
                  deleteFromCart={deleteFromCart}
                  handleQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </>
        )}

        {/* 드로어 footer */}
        <Col span={24} className={`${styles.drawer_footer} p-4`}>
          <Divider className="my-2" />
          {selectMode ? (
            <Button
              className="w-full rounded-lg"
              size="large"
              onClick={() => {
                setDrawerOpen(false);
                setSelectMode(false);
              }}
            >
              옵션 선택 닫기
            </Button>
          ) : (
            <>
              <Flex className="justify-between items-center mb-3">
                <span className="text-lg font-semibold">
                  {totalQuantity}개 선택
                </span>
                <div>
                  <span className="text-lg mr-1">총</span>
                  <span className="text-xl font-bold text-red-500">
                    {Number(totalPrice).toLocaleString()}원
                  </span>
                </div>
              </Flex>
              <Divider className="my-2" />
              <Flex className="gap-3">
                <Button
                  className="w-full rounded-lg"
                  size="large"
                  disabled={cart.length <= 0}
                  onClick={clickAddToCart}
                >
                  장바구니
                </Button>
                <Button
                  type="primary"
                  size="large"
                  className="w-full rounded-lg"
                  disabled={cart.length <= 0}
                  onClick={clickBuyHandler}
                >
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

export default Index;
