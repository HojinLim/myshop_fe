import { Button, Result } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotFound from '@/components/notfound';
import dayjs from '@/utils/dayjs';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) return <NotFound />;

  const { newOrder } = location.state;

  return (
    <Content className="h-full content-center">
      <Result
        status="success"
        title="주문이 완료되었습니다"
        subTitle={`${dayjs(newOrder?.createdAt).format(
          'YYYY.MM.DD'
        )} 주문하신 상품의 주문번호는 ${newOrder?.id} 입니다.`}
        extra={[
          <Button
            key="list"
            className="!rounded-3xl !mt-5"
            onClick={() => navigate('/mypage/orderList')}
          >
            주문상세 보기
          </Button>,
          <Button
            key="shop"
            type="primary"
            className="!rounded-3xl"
            onClick={() => navigate('/')}
          >
            계속 쇼핑하기
          </Button>,
        ]}
      />
    </Content>
  );
};

export default PaymentSuccess;
