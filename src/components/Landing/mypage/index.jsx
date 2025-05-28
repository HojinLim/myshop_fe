import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import {
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Col, Flex, message, Row, Typography } from 'antd';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MenuHeader from '@/components/common/MenuHeader';
import { logout } from '@/store/slices/userSlice';
import { getNonMemberId, returnBucketUrl } from '@/utils';
import { getCarts } from '@/api/cart';
import logo from '/logo.png';
import { fetchCartLength } from '@/store/slices/cartSlice';
const index = () => {
  const { Title, Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [cartNum, setCartNum] = useState(0);
  const [profilePic, setProfilePic] = useState(logo);
  const user = useSelector((state) => state.user.data);

  // redux로 카트 정보 가져오기
  const { cartNum, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartLength()); // ✅ 비동기 API 호출
  }, [dispatch]);

  useEffect(() => {
    if (user && user.id) {
    } else {
      navigate('/login', { replace: 'true' });
    }
    setProfilePic(returnBucketUrl(user.profileUrl));
  }, [user]);

  const RightItems = () => {
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
    <Content>
      <MenuHeader title="회원 정보 수정" rightItems={RightItems()} />
      <Flex className="items-center">
        <Avatar
          size={48}
          className={user.id ? 'cursor-pointer' : ''}
          onClick={() => {
            navigate('/mypage/setting');
          }}
          src={profilePic}
          onError={() => {
            setProfilePic(logo); // 기본 이미지 설정
            return false; // Ant Design 기본 동작 방지
          }}
        />
        <p className="font-bold ml-2">{user.username || '비회원'}</p>
      </Flex>
    </Content>
  );
};

export default index;
