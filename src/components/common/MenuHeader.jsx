import { Badge, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  LeftOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartLength } from '@/store/slices/cartSlice';

const MenuHeader = (props) => {
  const { title, rightItems } = props;
  // redux로 카트 정보 가져오기
  const { cartNum, loading, error } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartLength()); //  비동기 API 호출
  }, [dispatch]);

  const DefaultRightItems = () => {
    return (
      <>
        <SettingOutlined
          className="text-xl mr-2"
          onClick={() => {
            navigate('/mypage/setting');
          }}
        />
        <Badge count={cartNum} color="red">
          <ShoppingOutlined
            className="text-xl"
            onClick={() => {
              navigate('/cart');
            }}
          />
        </Badge>
      </>
    );
  };

  return (
    <Row className="py-6">
      <Col span={4}>
        <LeftOutlined
          // 뒤로가기
          onClick={() => {
            navigate(-1);
          }}
        />
      </Col>
      <Col span={16}>
        <Title level={5} className="text-center">
          {title}
        </Title>
      </Col>
      <Col span={4}>{rightItems || <DefaultRightItems />}</Col>
    </Row>
  );
};

export default MenuHeader;
