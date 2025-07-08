import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Input, // Input은 사용되지 않으므로 제거 가능
  Layout,
  message,
  Popconfirm,
  Row,
  Select,
  Typography,
} from 'antd';

import {
  HomeOutlined,
  UserOutlined,
  LeftOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { Content, Footer, Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { deleteCart, getCarts, updateCartQuantity } from '@/api/cart';
import { useSelector } from 'react-redux';
import { returnBucketUrl, getNonMemberId } from '@/utils';
import OptionDrawer from './OptionDrawer'; // OptionDrawer 컴포넌트 임포트

const Index = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [carts, setCarts] = useState([]); // 장바구니에 담긴 모든 상품 목록
  const [drawerOpen, setDrawer] = useState(false); // 옵션 변경 드로어 열림/닫힘 상태
  const [selectedCartItemForDrawer, setSelectedCartItemForDrawer] =
    useState(null); // 드로어에 전달할 현재 선택된 장바구니 아이템

  // 선택한 카트들 상태관리 (체크박스로 선택된 상품들)
  const [selectedCarts, setSelectedCarts] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [user.id]); // user.id가 변경될 때마다 장바구니 다시 불러오기

  // 장바구니 데이터를 불러오는 함수
  const fetchCart = async () => {
    try {
      const res = await getCarts(user.id || getNonMemberId());
      if (Array.isArray(res.cartItems)) {
        setCarts(res.cartItems);
        // 장바구니 데이터가 변경되면 선택된 카트 목록도 초기화하거나 재검증
        setSelectedCarts((prev) => {
          const newSelected = prev
            .filter((selectedItem) =>
              res.cartItems.some((newItem) => newItem.id === selectedItem.id)
            )
            .map((selectedItem) => {
              const updatedItem = res.cartItems.find(
                (newItem) => newItem.id === selectedItem.id
              );
              return updatedItem ? updatedItem : selectedItem; // 최신 데이터로 업데이트
            });
          return newSelected;
        });
      } else {
        setCarts([]);
      }
    } catch (err) {
      console.error('장바구니 불러오기 오류:', err);
      message.error('장바구니를 불러오는 데 실패했습니다.');
    }
  };

  // 수량 업데이트 핸들러
  const clickUpdate = async (type, item) => {
    let updateQuantity = item.quantity;
    if (type === 'minus') {
      updateQuantity = Math.max(1, updateQuantity - 1); // 최소 수량 1
    } else {
      updateQuantity = updateQuantity + 1;
    }

    // 재고 확인 로직 (옵션 상품과 단일 상품 구분)
    console.log(item.Product);

    let maxStock = 0;
    if (item.product_option_id) {
      // 옵션 상품
      maxStock = item.product_option?.stock || 0;
    } else {
      // 단일 상품
      maxStock = item.Product?.stock || 0; // Product 모델에 stock 필드가 있다고 가정
    }

    if (updateQuantity > maxStock && maxStock > 0) {
      message.warn(
        `재고가 부족합니다. 최대 ${maxStock}개까지 구매 가능합니다.`
      );
      return;
    }
    if (maxStock === 0 && type === 'plus') {
      message.warn('품절된 상품입니다.');
      return;
    }

    const params = {
      user_id: user.id || getNonMemberId(),
      product_option_id: item.product_option_id, // 옵션 상품인 경우 product_option_id 사용
      product_id: item.product_option_id ? null : item.product_id, // 단일 상품인 경우 product_id 사용
      quantity: updateQuantity,
    };

    try {
      await updateCartQuantity(params);
      fetchCart(); // 업데이트 후 장바구니 새로고침
    } catch (err) {
      console.error('수량 업데이트 오류:', err);
      message.error(err.message || '수량 업데이트에 실패했습니다.');
    }
  };

  // 장바구니에서 해당 상품을 삭제
  const confirmDeleteCart = async (item) => {
    try {
      const res = await deleteCart(item.id);
      message.success(res.message);
      fetchCart(); // 삭제 완료 후 장바구니 새로고침
    } catch (err) {
      console.error('장바구니 항목 삭제 오류:', err);
      message.error(err.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  // 장바구니에서 선택된 해당 상품들을 삭제
  const confirmDeleteSelectCart = async () => {
    if (selectedCarts.length <= 0) {
      message.warn('선택된 상품이 없습니다.');
      return;
    }
    try {
      const promises = selectedCarts.map((item) => deleteCart(item.id));
      await Promise.all(promises); // 모든 삭제 요청 병렬 처리
      message.success('선택된 상품이 삭제되었습니다.');
      setSelectedCarts([]); // 선택 목록 초기화
      fetchCart(); // 삭제 완료 후 장바구니 새로고침
    } catch (err) {
      console.error('선택 상품 삭제 중 오류 발생:', err);
      message.error(err.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  // 장바구니 상품 개별 체크 핸들러
  const handleSingleCheck = (e, item) => {
    if (e.target.checked) {
      setSelectedCarts((prev) =>
        prev.some((el) => el.id === item.id) ? prev : [...prev, item]
      );
    } else {
      setSelectedCarts((prev) => prev.filter((el) => el.id !== item.id));
    }
  };

  // 장바구니 상품 전체 체크 핸들러
  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setSelectedCarts(carts);
    } else {
      setSelectedCarts([]);
    }
  };

  // 선택된 상품의 총 상품 가격 계산
  const totalPrice = () => {
    const total = selectedCarts.reduce((acc, cur) => {
      // product_option_id가 있으면 옵션 가격, 없으면 Product의 discountPrice 사용
      const itemPrice =
        cur.product_option?.price || cur.Product?.discountPrice || 0;
      return acc + Number(itemPrice) * cur.quantity;
    }, 0);
    return Number(total).toLocaleString();
  };

  // 구매 버튼 핸들러
  const buyHandler = () => {
    if (selectedCarts.length === 0) {
      message.warn('구매할 상품을 선택해주세요.');
      return;
    }
    // 결제 페이지로 전달할 데이터 구조를 통일
    const itemsToPurchase = selectedCarts.map((item) => {
      if (item.product_option_id) {
        // 옵션 상품
        return {
          ...item.product_option, // 옵션 정보
          product_id: item.product_option.Product.id, // 부모 상품 ID
          product_name: item.product_option.Product.name, // 부모 상품 이름
          product_originPrice: item.product_option.Product.originPrice, // 부모 상품 원가
          quantity: item.quantity,
          imageUrl: item.product_option.Product.ProductImages[0]?.imageUrl, // 메인 이미지 URL
        };
      } else {
        // 단일 상품
        return {
          id: null,
          size: null, // 옵션 없으므로 null
          color: null, // 옵션 없으므로 null
          price: item.Product.discountPrice, // 단일 상품의 할인 가격
          stock: item.Product.stock, // 단일 상품의 재고
          product_id: item.Product.id,
          product_name: item.Product.name,
          product_originPrice: item.Product.originPrice,
          quantity: item.quantity,
          imageUrl: item.Product.ProductImages[0]?.imageUrl, // 메인 이미지 URL
        };
      }
    });
    navigate('/payment', { state: itemsToPurchase });
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <LeftOutlined
          onClick={() => {
            navigate(-1);
          }}
        />
        <div className={styles.title_container}>
          <p>장바구니</p>
        </div>
        <div className={styles.navi_icon_container}>
          <HomeOutlined
            onClick={() => {
              navigate('/');
            }}
          />
          <UserOutlined
            className="ml-3"
            onClick={() => {
              navigate('/mypage');
            }}
          />
        </div>
      </Header>
      <Content className={styles.content_layout}>
        <Flex justify="space-between" className={styles.select_container}>
          <div className="flex items-center">
            {' '}
            {/* 중앙 정렬 추가 */}
            {/* 장바구니 전체 체크 핸들러 */}
            <input
              type="checkbox"
              checked={
                carts.length > 0 && selectedCarts.length === carts.length
              }
              onChange={handleAllCheck}
              className="mr-2"
            />
            <p className="ml-2">{`전체선택(${selectedCarts.length || 0}/${
              carts.length || 0
            })`}</p>
          </div>
          <Popconfirm
            title="삭제"
            description="선택한 상품을 삭제하시겠어요?"
            onConfirm={confirmDeleteSelectCart}
            okText="확인"
            cancelText="취소"
          >
            <p className="mr-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              선택삭제
            </p>
          </Popconfirm>
        </Flex>
        <Divider className="my-2" /> {/* 여백 조정 */}
        {/* 장바구니 상품들 */}
        {carts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            장바구니에 담긴 상품이 없습니다.
          </div>
        ) : (
          carts.map((item, index) => {
            // 옵션 상품인지 단일 상품인지 구분
            const isOptionProduct = !!item.product_option_id;
            const productInfo = isOptionProduct
              ? item.product_option?.Product
              : item.Product;
            const itemPrice = isOptionProduct
              ? item.product_option?.price
              : item.Product?.discountPrice;
            const itemOriginPrice = isOptionProduct
              ? item.product_option?.Product?.originPrice
              : item.Product?.originPrice;
            const itemStock = isOptionProduct
              ? item.product_option?.stock
              : item.Product?.stock;

            return (
              <React.Fragment key={item.id}>
                {' '}
                {/* key를 item.id로 변경 */}
                <Flex className={styles.product_item}>
                  {/* 개별 장바구니 상품 체크박스 */}
                  <input
                    className={styles.select_btn}
                    type="checkbox"
                    checked={selectedCarts.some((el) => el.id === item.id)}
                    onChange={(e) => handleSingleCheck(e, item)}
                  />
                  <Flex vertical className="w-full">
                    <Flex align="flex-start">
                      {/* 이미지와 상품명 정렬 */}
                      <div className="aspect-square overflow-hidden rounded-md w-20 h-20 mr-3">
                        {/* 이미지 크기 고정 */}
                        <img
                          className="w-full h-full object-contain"
                          src={
                            productInfo?.ProductImages &&
                            productInfo.ProductImages.length > 0
                              ? returnBucketUrl(
                                  productInfo.ProductImages.find(
                                    (img) => img.type === 'main'
                                  )?.imageUrl
                                )
                              : 'https://placehold.co/80x80/cccccc/333333?text=No+Image' // 기본 이미지
                          }
                          alt={productInfo?.name || '상품 이미지'}
                        />
                      </div>
                      <div className="flex-grow">
                        <Typography.Text strong className="block mb-1">
                          {productInfo?.name || '상품명 없음'}
                        </Typography.Text>
                        {/* 옵션 선택 또는 단일 상품 표시 */}
                        {isOptionProduct ? (
                          <Select
                            className={styles.select}
                            value={`${item.product_option?.color || ''} / ${
                              item.product_option?.size || ''
                            }`}
                            style={{ width: '100%', maxWidth: '150px' }} // 너비 조정
                            open={false} // 드롭다운 강제 닫기
                            onClick={() => {
                              setDrawer(true);
                              setSelectedCartItemForDrawer(item); // 현재 아이템을 드로어에 전달
                            }}
                          />
                        ) : (
                          <Typography.Text
                            type="secondary"
                            className="block text-sm"
                          >
                            단일 상품
                          </Typography.Text>
                        )}
                      </div>
                      <Popconfirm
                        title="삭제"
                        description="선택한 상품을 삭제하시겠어요?"
                        onConfirm={() => confirmDeleteCart(item)}
                        okText="확인"
                        cancelText="취소"
                      >
                        <CloseOutlined className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer text-lg ml-2" />{' '}
                        {/* 스타일 조정 */}
                      </Popconfirm>
                    </Flex>
                    <Flex
                      justify="space-between"
                      align="center"
                      className="mt-2"
                    >
                      {/* 수량과 가격 정렬 */}
                      <div className="flex items-center">
                        <Button
                          shape="circle"
                          disabled={item.quantity <= 1}
                          onClick={() => clickUpdate('minus', item)}
                          className="w-8 h-8 flex items-center justify-center" // 버튼 크기 고정
                        >
                          -
                        </Button>
                        <p className="mx-3 font-bold text-lg">
                          {item.quantity}
                        </p>
                        <Button
                          shape="circle"
                          onClick={() => clickUpdate('plus', item)}
                          className="w-8 h-8 flex items-center justify-center" // 버튼 크기 고정
                        >
                          +
                        </Button>
                      </div>
                      {/* 상품 아이템 가격 */}
                      <div className="flex items-center">
                        {itemOriginPrice &&
                          itemPrice &&
                          itemOriginPrice > itemPrice && (
                            <p className="line-through mr-1 text-xs text-gray-400">
                              {Number(
                                itemOriginPrice * item.quantity
                              ).toLocaleString()}
                              원
                            </p>
                          )}
                        <p className="font-bold text-base text-red-600">
                          {Number(itemPrice * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    </Flex>
                    {itemStock !== undefined &&
                      itemStock <= 5 &&
                      itemStock > 0 && (
                        <Typography.Text
                          type="warning"
                          className="text-sm mt-1"
                        >
                          재고 {itemStock}개 남음!
                        </Typography.Text>
                      )}
                    {itemStock === 0 && (
                      <Typography.Text type="danger" className="text-sm mt-1">
                        품절
                      </Typography.Text>
                    )}
                  </Flex>
                </Flex>
                <Divider className={styles.custom_divider} />
              </React.Fragment>
            );
          })
        )}
        {/* 결제 컨테이너 */}
        <Flex vertical className={styles.pay_container}>
          <p className={styles.pay_title}>예상 결제금액</p>
          <Flex justify="space-between" className="mb-2">
            <p>총 상품금액</p>
            <p>{totalPrice()}원</p>
          </Flex>
          {/* <Flex justify="space-between" className="mb-2">
            <p>상품할인</p>
            <p>0원</p>
          </Flex> */}
          <Flex justify="space-between" className="mb-2">
            <p>배송비</p>
            <p>무료배송</p>
          </Flex>
          <Divider className="my-2" />
          <Flex justify="space-between" className="mb-2">
            <p className="font-bold text-lg">
              총 {selectedCarts.reduce((acc, cur) => acc + cur.quantity, 0)}개
              주문금액
            </p>
            <p className="font-bold text-lg text-red-600">{totalPrice()}원</p>
          </Flex>
        </Flex>
      </Content>
      {/* OptionDrawer는 선택된 장바구니 아이템의 product_option.Product.product_options를 전달 */}
      {selectedCartItemForDrawer && (
        <OptionDrawer
          drawerOpen={drawerOpen}
          setDrawer={setDrawer}
          // 옵션 상품의 모든 옵션 리스트를 전달
          options={
            selectedCartItemForDrawer.product_option?.Product
              ?.product_options || []
          }
          // 현재 선택된 장바구니 아이템을 전달
          selectedCart={selectedCartItemForDrawer}
          fetchCart={fetchCart}
        />
      )}
      <Footer className={styles.footer}>
        <Button
          className={styles.buy_button}
          disabled={selectedCarts.length <= 0}
          type="primary" // Ant Design primary 버튼 스타일 적용
          size="large"
          onClick={buyHandler}
        >
          {totalPrice() === '0' ? '상품 선택' : `${totalPrice()}원 주문하기`}
        </Button>
      </Footer>
    </Layout>
  );
};

export default Index;
