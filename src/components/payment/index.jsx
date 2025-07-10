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
  Row,
  Typography,
} from 'antd'; // InputNumber는 사용되지 않으므로 제거
import { message } from 'antd';
import Title from 'antd/es/typography/Title';
import {
  UpOutlined,
  DownOutlined,
  // InfoCircleOutlined, // 사용되지 않으므로 제거
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { returnBucketUrl, toWon } from '@/utils';
import { useSelector } from 'react-redux';
import { payWithoutMoney, testPayment } from '@/api/payment';
import { CONSTANTS } from '@/constants';
import NotFound from '@/components/notfound';

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [point, setPoint] = useState(0); // 초기 포인트 사용 값 0으로 설정
  const [useAll, setUseAll] = useState(false);
  const location = useLocation();
  const items = location.state || [];
  const user = useSelector((state) => state.user.data);
  const [buttonIdx, setButtonIdx] = useState(null);
  const navigate = useNavigate();

  // 거래할 상품 정보 없음 처리
  if (!location.state || items.length === 0) return <NotFound />;

  // 상품의 총 갯수
  const getProductNum = () => {
    const totalNum = items.reduce((acc, cur) => acc + cur.quantity, 0);
    return totalNum;
  };

  // 총 상품 금액
  const totalPrice = () => {
    const total = items.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
    return total;
  };

  // 포인트 핸들러
  const editPointHandler = (e) => {
    const value = e.target.value;
    // 숫자만 허용 (빈 값도 허용)
    if (value !== '' && !/^\d+$/.test(value)) return;

    let newPoint = Number(value);
    // 사용 가능한 최대 포인트는 유저가 가진 포인트 또는 총 상품 금액 중 작은 값
    const maxUsablePoint = Math.min(user.points, totalPrice());

    if (newPoint > maxUsablePoint) {
      newPoint = maxUsablePoint; // 최대 사용 가능 포인트로 제한
      message.warning(
        `최대 ${toWon(maxUsablePoint)}원까지 사용할 수 있습니다.`
      );
    }

    setPoint(newPoint);
    setUseAll(newPoint === maxUsablePoint); // '모두 사용' 상태 업데이트
  };

  // 포인트 모두 사용/취소 핸들러
  const useAllPointHandler = () => {
    const maxUsablePoint = Math.min(user.points, totalPrice());

    if (!useAll) {
      // 모두 사용 활성화
      setPoint(maxUsablePoint);
      setUseAll(true);
    } else {
      // 사용 취소
      setPoint(0);
      setUseAll(false);
    }
  };

  // 최종 결제 금액 계산
  const finalPaymentAmount = () => {
    return totalPrice() - point;
  };

  // 결제 수행 핸들러
  const onClickPayment = async () => {
    if (buttonIdx === null && finalPaymentAmount() > 0) {
      message.warning('결제 방법을 선택해주세요.');
      return;
    }

    // 포인트로만 결제 시 자사몰 내부적 처리
    if (finalPaymentAmount() === 0) {
      if (point === 0 && totalPrice() > 0) {
        // 상품 금액이 있는데 포인트 사용을 안 했을 경우
        message.warning('결제할 금액이 0원입니다. 포인트를 사용해주세요.');
        return;
      }
      try {
        const res = await payWithoutMoney(user.id, totalPrice(), point, items);
        navigate('/payment_success', { state: res });
      } catch (err) {
        message.error(
          err.message || '포인트 결제 처리 중 오류가 발생했습니다.'
        );
        console.error(err);
      }
      return;
    }

    // PG사를 통한 결제
    let pay_method = '';
    if (buttonIdx === 0) {
      pay_method = CONSTANTS.KAKAO_PG;
    } else if (buttonIdx === 1) {
      pay_method = CONSTANTS.KG_PG; // '카드' 버튼이 KG_PG라고 가정
    } else {
      // 다른 결제 방법 (현금, 휴대폰 등)은 현재 disabled 처리되어 있으므로 여기에 도달하지 않음
      // 만약 나중에 활성화된다면 각 PG사에 맞는 pay_method를 지정해야 함
      message.warning('선택할 수 없는 결제 방법입니다.');
      return;
    }

    try {
      const res = await testPayment(
        pay_method,
        point,
        user.id,
        items,
        finalPaymentAmount()
      );

      if (res?.success) {
        message.success('결제 성공!');
        navigate('/payment_success', { state: res });
      }
    } catch (err) {
      message.error(err.message || '결제 처리 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  // 결제 버튼들
  const payButtons = [
    {
      title: '간편결제',
      disabled: false,
    },
    {
      title: '카드',
      disabled: false,
    },
    {
      title: '현금',
      disabled: true,
    },
    {
      title: '휴대폰',
      disabled: true,
    },
  ];
  console.log(items);

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
                    src={
                      item.imageUrl // 이미 정제된 imageUrl 사용
                        ? returnBucketUrl(item.imageUrl)
                        : '/none_logo.png' // 기본 이미지
                    }
                    alt={item.product_name || '상품 이미지'}
                  />
                  <Flex vertical className="ml-2">
                    <Typography.Text>{item.product_name}</Typography.Text>{' '}
                    {/* product_name 사용 */}
                    <Flex>
                      <p className="font-bold mr-2">{toWon(item.price)}원</p>{' '}
                      {/* toWon 적용 */}
                      <p className="text-gray-400">수량 {item.quantity}개</p>
                    </Flex>
                  </Flex>
                </Flex>
                {/* 옵션 정보 표시 (color 또는 size가 있을 경우만) */}
                {(item.color || item.size) && (
                  <Text className={styles.item_container}>
                    {item.color} / {item.size}
                  </Text>
                )}
                {/* 옵션이 없는 단일 상품일 경우 */}
                {!item.color && !item.size && (
                  <Text className={styles.item_container}>옵션 없음</Text>
                )}
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
          <h4>포인트</h4>
        </Col>

        <Col span={20}>
          <Input
            variant="underlined"
            placeholder="포인트"
            value={point === 0 && useAll === false ? '' : point} // 0일때 빈값으로 보여주기
            onChange={editPointHandler}
            maxLength={9}
          />
        </Col>
        <Col span={4}>
          <Button onClick={useAllPointHandler} className="w-full">
            {!useAll ? '모두 사용' : '사용 취소'}
          </Button>
        </Col>
        <p className="text-gray-400 !mt-3">
          잔여:{toWon(user.points - point)}원
        </p>
      </Row>
      <Divider />
      <Col span={24}>
        <Flex className="justify-between">
          <p className="text-xl">총 결제 금액</p>
          <p className="text-xl text-red-400">
            {toWon(finalPaymentAmount())}원
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
          <p className="text-gray-400">포인트 할인</p>
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
              className={
                buttonIdx === idx
                  ? `${styles.button} ${styles.clicked}`
                  : styles.button
              }
              onClick={() => {
                setButtonIdx(idx);
              }}
              disabled={pay.disabled}
            >
              {pay.title}
            </button>
          </Col>
        ))}
      </Row>
      {buttonIdx === 0 && ( // 간편결제 선택 시 카카오페이/네이버페이 표시
        <Row className="mt-3">
          <Col span={24} className="mb-2">
            <Flex>
              <input
                type="radio"
                id="kakao"
                name="payMethod" // name 통일
                value="kakao"
                defaultChecked
              />
              <img
                className="mx-1"
                width={50}
                src="/kakao_pay.png"
                alt="카카오페이"
              />
              <label htmlFor="kakao">카카오페이</label>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex>
              <input
                type="radio"
                id="naver"
                name="payMethod" // name 통일
                value="naver"
                disabled
              />
              <img
                className="mx-1"
                width={50}
                src="/naver_pay.png"
                alt="네이버페이"
              />
              <label htmlFor="naver">네이버페이</label>
            </Flex>
          </Col>
        </Row>
      )}
      <div className={styles.bottom_container} span={24}>
        <Divider />
        <Button onClick={onClickPayment}>
          {toWon(finalPaymentAmount())}원 결제하기
        </Button>
      </div>
    </Content>
  );
};

export default Index;
