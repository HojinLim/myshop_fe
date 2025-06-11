import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Input,
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
import OptionDrawer from './OptionDrawer';
const index = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [carts, setCarts] = useState([]);
  const [drawerOpen, setDrawer] = useState(false);
  const [options, setOptions] = useState([]);
  const [itemIndex, setItemIndex] = useState(null);

  // 선택한 카트들 상태관리
  const [selectedCarts, setSelectedCarts] = useState([]);
  console.log(selectedCarts);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    await getCarts(user.id || getNonMemberId())
      .then((res) => {
        console.log(res);
        setCarts(res.cartItems);
        console.log('res.cartItems', res.cartItems);

        // message.success('카트 불러오기 완료 ');
        if (Array.isArray(res.cartItems) && res.cartItems.length) {
          const mappedOptions = res.cartItems.map((item) =>
            item.product_option.Product.product_options.map((opt) => ({
              ...opt,
              checked: opt.id === item.product_option_id, // 현재 옵션이면 checked: true
            }))
          );
          setOptions(mappedOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const selectOption = (index) => {
    if (options.length > 0) {
      return options[index].find((val) => val.checked);
    }
  };
  const clickUpdate = async (type, item) => {
    const { product_option_id, quantity } = item;
    let updateQuantity = quantity;
    const params = {
      user_id: user.id || getNonMemberId(),
      product_option_id,
      quantity: type === 'minus' ? --updateQuantity : ++updateQuantity,
    };

    await updateCartQuantity(params)
      .then((res) => {
        console.log(res);
        fetchCart();

        // 선택된 카트 항목도 업데이트!
        setSelectedCarts((prev) =>
          prev.map((el) =>
            el.id === item.id ? { ...el, quantity: updateQuantity } : el
          )
        );
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };
  console.log(selectedCarts);

  // 장바구니에서 해당 상품을 삭제
  const confirmDeleteCart = async (item) => {
    await deleteCart(item.id)
      .then((res) => {
        console.log(res);
        message.success(res.message);
        fetchCart();
      })
      .catch((err) => message.error(err.message));
  };
  // 장바구니에서 선택된 해당 상품들을 삭제
  const confirmDeleteSelectCart = async () => {
    if (selectedCarts.length <= 0) return;
    try {
      const promises = selectedCarts.map((item) => deleteCart(item.id));

      const responses = await Promise.all(promises); // 모든 삭제 요청 병렬 처리

      message.success(responses[0].message);
      fetchCart(); // 삭제 완료 후 장바구니 새로고침
    } catch (err) {
      console.error('❌ 삭제 중 오류 발생:', err);
      message.error(err.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  // 장바구니 상품 개별 체크 핸들러
  const handleSingleCheck = (e, item) => {
    // 개별 상품을 체크 리스트에 추가
    if (e.target.checked) {
      setSelectedCarts((prev) =>
        prev.some((el) => el.id === item.id) ? prev : [...prev, item]
      );
    }
    // 개별 상품을 리스트에서 제외
    else {
      setSelectedCarts((prev) => {
        const filterd = prev.filter((el) => el.id !== item.id);
        return [...filterd];
      });
    }
  };
  // 장바구니 상품 전체 체크 핸들러
  const handleAllCheck = (e) => {
    // 전체 상품을 체크 리스트에 추가
    if (e.target.checked) {
      setSelectedCarts(carts);
    }
    // 리스트 비우기
    else {
      setSelectedCarts([]);
    }
  };

  // 선택된 상품의 총 상품 가격
  const totalPrice = () => {
    return Number(
      selectedCarts.reduce(
        (acc, cur) => acc + Number(cur.product_option.price) * cur.quantity,

        0
      )
    ).toLocaleString();
  };

  // 구매 버튼 핸들러
  const buyHandler = () => {
    const newArr = selectedCarts.map((item, idx) => ({
      ...item.product_option,
      quantity: item.quantity,
    }));
    navigate('/payment', { state: newArr });
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <LeftOutlined />
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
          <div className="flex">
            {/* 장바구니 전체 체크 핸들러 */}
            <input
              type="checkbox"
              checked={
                carts.length !== 0 && selectedCarts.length === carts.length
              }
              onChange={handleAllCheck}
            />
            <p>{`전체선택(${selectedCarts.length || 0}/${
              carts.length || 0
            })`}</p>
          </div>
          <Popconfirm
            title="삭제"
            description="선택한 상품을 삭제하시겠어요?"
            onConfirm={confirmDeleteSelectCart}
            // onCancel={cancel}
            okText="확인"
            cancelText="취소"
          >
            <p>선택삭제</p>
          </Popconfirm>
        </Flex>
        <Divider />
        {/* 장바구니 상품들 */}
        {carts.map((item, index) => (
          <React.Fragment key={index}>
            <Flex className={styles.product_item}>
              {/* 개별 장바구니 상품 체크박스 */}
              <input
                className={styles.select_btn}
                type="checkbox"
                checked={selectedCarts.some((el) => el.id === item.id)}
                onChange={(e) => handleSingleCheck(e, item)}
              />
              <Flex vertical className="w-full">
                <Flex>
                  <div className="aspect-square overflow-hidden rounded-md w-20">
                    <img
                      className="w-full h-full object-fit"
                      src={returnBucketUrl(
                        item.product_option.Product.ProductImages[0].imageUrl
                      )}
                    />
                  </div>
                  <p className="ml-1">{item.product_option.Product.name}</p>
                  <Popconfirm
                    title="삭제"
                    description="선택한 상품을 삭제하시겠어요?"
                    onConfirm={() => confirmDeleteCart(item)}
                    // onCancel={cancel}
                    okText="확인"
                    cancelText="취소"
                  >
                    <CloseOutlined className={styles.close_btn} />
                  </Popconfirm>
                </Flex>
                {/* 옵션 선택 */}
                <Select
                  className={styles.select}
                  value={`${selectOption(index)?.color} / ${
                    selectOption(index)?.size
                  }`}
                  style={{ width: 120 }}
                  open={false}
                  onClick={() => {
                    setDrawer(true);
                    setItemIndex(index);
                  }}
                />
                <Flex justify="space-between">
                  <div className="flex items-center">
                    <Button
                      shape="circle"
                      disabled={item.quantity <= 1}
                      onClick={() => clickUpdate('minus', item)}
                    >
                      -
                    </Button>
                    <p className="mx-3 font-bold">{item.quantity}</p>
                    <Button
                      shape="circle"
                      onClick={() => clickUpdate('plus', item)}
                    >
                      +
                    </Button>
                  </div>
                  {/* 상품 아이템 가격 */}
                  <div className="flex items-center">
                    <p className="line-through mr-1 text-xs text-gray-300">
                      {Number(
                        item.product_option.Product.originPrice * item.quantity
                      ).toLocaleString()}
                      원
                    </p>
                    <p className="font-bold">
                      {Number(
                        item.product_option.price * item.quantity
                      ).toLocaleString()}
                      원
                    </p>
                  </div>
                </Flex>
              </Flex>
            </Flex>

            <Divider className={styles.custom_divider} />
          </React.Fragment>
        ))}

        {/* 결제 컨테이너 */}
        <Flex vertical className={styles.pay_container}>
          <p className={styles.pay_title}>예상 결제금액</p>
          <Flex justify="space-between">
            <p>총 상품금액</p>
            <p>{totalPrice()}원</p>
          </Flex>
          <Flex justify="space-between">
            <p>상품할인</p>
            <p>0원</p>
          </Flex>
          <Flex justify="space-between">
            <p>쿠폰할인</p>
            <Button>쿠폰 선택</Button>
          </Flex>
          <Flex justify="space-between">
            <p>배송비</p>
            <p>무료배송</p>
          </Flex>
          <Divider />
          <Flex justify="space-between">
            <p>
              총 {selectedCarts.reduce((acc, cur) => acc + cur.quantity, 0)}개
              주문금액
            </p>
            <p>{totalPrice()}원</p>
          </Flex>
        </Flex>
      </Content>
      <OptionDrawer
        drawerOpen={drawerOpen}
        setDrawer={setDrawer}
        options={options[itemIndex]}
        setOptions={setOptions}
        fetchCart={fetchCart}
        selectedCart={carts[itemIndex]}
      />
      <Footer className={styles.footer}>
        <Button
          className={styles.buy_button}
          disabled={selectedCarts.length <= 0}
          color="blue"
          onClick={buyHandler}
        >
          {totalPrice() == 0 ? '' : `${totalPrice()}원`} 주문하기
        </Button>
      </Footer>
    </Layout>
  );
};

export default index;
