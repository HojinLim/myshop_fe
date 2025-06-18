import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content } from 'antd/es/layout/layout';
import {
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Input,
  InputNumber,
  Row,
  Typography,
} from 'antd';
import Title from 'antd/es/typography/Title';
import {
  UpOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { returnBucketUrl, toWon } from '@/utils';
import { useSelector } from 'react-redux';
import { testPayment } from '@/api/payment';
import { CONSTANTS } from '@/constants';
const index = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [point, setPoint] = useState(null);
  const [useAll, setUseAll] = useState(false);
  const location = useLocation();
  const items = location.state || [];
  const user = useSelector((state) => state.user.data);
  const [buttonIdx, setButtonIdx] = useState(null);

  // 상품의 총 갯수
  const getProductNum = () => {
    const totalNum = items.reduce((acc, cur) => acc + cur.quantity, 0);
    return totalNum;
  };
  // 총 금액
  const totalPrice = () => {
    const totalNum = items.reduce(
      (acc, cur) => acc + cur.quantity * cur.price,
      0
    );
    return totalNum;
  };
  // 포인트 핸들러
  const editPointHandler = (e) => {
    const value = e.target.value;

    // 숫자만 허용 (빈 값도 허용)
    if (value !== '' && !/^\d+$/.test(value)) return;

    setPoint(value);
  };
  // 포인트 전부 사용 핸들러
  const useAllPointHandler = () => {
    // 유저 포인트가 상품을 구입 할만큼 있음
    if (user.points >= totalPrice() && !useAll) {
      setUseAll(true);
      setPoint(totalPrice());
    }
    // 포인트 사용 취소
    else if (user.points >= totalPrice() && useAll) {
      setUseAll(false);
      setPoint(null);
    }
  };
  // 결제 수행 핸들러
  const onClickPayment = async () => {
    await testPayment(
      CONSTANTS.KAKAO_PG,
      point,
      user.id,
      items,
      totalPrice() - point
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 결제 버튼들
  const payButtons = [
    {
      title: '간편결제',
    },
    {
      title: '카드',
    },
    {
      title: '현금',
    },
    {
      title: '휴대폰',
    },
  ];

  const { Text } = Typography;
  return (
    <Content className={styles.payment_container}>
      <Row>
        <Col span={24}>
          <Flex
            justify="space-between"
            align="center"
            className={styles.menu_container}
          >
            <Title level={4}>주문 상품 총 {getProductNum()}개</Title>

            <div onClick={(e) => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <UpOutlined className="cursor-pointer" />
              ) : (
                <DownOutlined className="cursor-pointer" />
              )}
            </div>
          </Flex>
        </Col>

        <Col span={24} className="p-5">
          <Title level={5}>배송 상품 {getProductNum()}개</Title>
          {menuOpen &&
            items.map((item, index) => (
              <Flex key={index} vertical className={styles.product_item}>
                <Flex>
                  <Image
                    width={50}
                    src={returnBucketUrl(
                      item.Product?.ProductImages[0].imageUrl || ''
                    )}
                  ></Image>
                  <Flex vertical>
                    <Typography.Text>{item.Product.name}</Typography.Text>
                    <Flex>
                      <p className="font-bold mr-2">{item.price}원</p>
                      <p className="text-gray-400">수량 {item.quantity}개</p>
                    </Flex>
                  </Flex>
                </Flex>
                <Text className={styles.item_container} level={4}>
                  {item.color} / {item.size}
                </Text>
              </Flex>
            ))}
        </Col>

        <Divider />
        <Content>
          <Col span={24}>
            <Flex justify="space-between">
              <h4>배송지 정보</h4>
              <span className="text-blue-500 cursor-pointer">입력하기</span>
            </Flex>
            <div className="text-gray-400">배송지를 입력해주세요.</div>
          </Col>
        </Content>
        <Divider />

        <Col span={24}>
          <h4>쿠폰 / 포인트</h4>
        </Col>
        {/* 쿠폰 input */}
        <Col span={20} className="mb-4">
          <Input variant="underlined" placeholder="쿠폰" />
        </Col>
        <Col span={4}>
          <Button>쿠폰 선택</Button>
        </Col>

        <Col span={20}>
          <Input
            variant="underlined"
            placeholder="포인트"
            value={point}
            onChange={editPointHandler}
          />
        </Col>
        <Col span={4}>
          <Button onClick={useAllPointHandler}>
            {!useAll ? '모두 사용' : '사용 취소'}
          </Button>
        </Col>
        <p className="text-gray-400 !mt-3">
          잔여:{toWon(user.points - point || 0)}원
        </p>
      </Row>
      <Divider />
      <Col span={24}>
        <Flex className="justify-between">
          <p className="text-xl">총 결제 금액</p>
          <p className="text-xl text-red-400">
            {toWon(totalPrice() - point)}원
          </p>
        </Flex>
        <Divider />
      </Col>
      <Col span={24}>
        <Flex className="justify-between !mb-3">
          <p className="text-gray-400">총 상품금액</p>
          <p className="font-medium">{toWon(totalPrice())}원</p>
        </Flex>
        <Flex className="justify-between !mb-3">
          <p className="text-gray-400">쿠폰/포인트 할인</p>
          <p className="font-medium">
            {`${point > 0 ? '-' : ''}`}
            {toWon(point)}원
          </p>
        </Flex>
        <Flex className="justify-between !mb-3">
          <p className="text-gray-400">배송비</p>
          <p className="font-medium">0원</p>
        </Flex>
        <Divider />
      </Col>
      <Col span={24}>
        <h4>결제 방법</h4>
      </Col>
      <Row className={styles.button_container}>
        {payButtons.map((pay, idx) => (
          <Col key={idx} span={6}>
            <button
              onClick={() => {
                setButtonIdx(idx);
              }}
            >
              {pay.title}
            </button>
          </Col>
        ))}
      </Row>
      {buttonIdx === 0 && (
        <Row className="mt-3">
          <Col span={24} className="mb-2">
            <Flex>
              <input type="radio" id="kakao" name="contact" value="kakao" />
              <img className="mx-1" width={50} src="./kakao_pay.png" />
              <label htmlFor="kakao">카카오페이</label>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex>
              <input type="radio" id="naver" name="contact" value="naver" />
              <img className="mx-1" width={50} src="./naver_pay.png" />
              <label htmlFor="naver">네이버페이</label>
            </Flex>
          </Col>
        </Row>
      )}
      <div className={styles.bottom_container} span={24}>
        <Divider />
        <Button onClick={onClickPayment}>
          {toWon(totalPrice() - point)}원 결제하기
        </Button>
      </div>
    </Content>
  );
};

export default index;
