import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import {
  ContainerTwoTone,
  EditTwoTone,
  HeartOutlined,
  HeartTwoTone,
  MessageTwoTone,
  SettingOutlined,
  ShoppingOutlined,
  SmileTwoTone,
  TagsTwoTone,
} from '@ant-design/icons';
import { Avatar, Badge, Col, Flex, message, Row, Typography } from 'antd';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MenuHeader from '@/components/common/MenuHeader';
import { logout } from '@/store/slices/userSlice';
import { getNonMemberId, returnBucketUrl, toWon } from '@/utils';
import { getCarts } from '@/api/cart';
import logo from '/logo.png';
import { fetchCartLength } from '@/store/slices/cartSlice';
import { myFavorite } from '@/api/favorite';
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

  // 마이페이지- 메뉴 아이템들
  const menuItems = [
    {
      icon: <ContainerTwoTone />,
      title: '주문내역',
      content: '0',
      handler: () => {
        navigate('/mypage/orderList');
      },
    },
    {
      icon: <HeartTwoTone />,
      title: '찜목록',
      content: '0',
      handler: () => {
        navigate('/mypage/favorite');
      },
    },
    {
      icon: <EditTwoTone />,
      title: '리뷰',
      content: '0',
      handler: () => {
        navigate('/mypage/review');
      },
    },
    {
      icon: <MessageTwoTone />,
      title: '문의',
      content: '0',
      handler: () => {},
    },
    {
      icon: <TagsTwoTone />,
      title: '쿠폰',
      content: '0장',
      handler: () => {},
    },
    {
      icon: <SmileTwoTone />,
      title: '포인트',
      content: `${toWon(user.points)}원`,
      handler: () => {
        navigate('/mypage/points');
      },
    },
  ];
  return (
    <Content>
      <MenuHeader title="마이 페이지" />
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
      <Flex className={styles.items_container}>
        {menuItems.map((item, idx) => (
          <Flex
            key={idx}
            vertical
            className="cursor-pointer"
            onClick={item.handler}
          >
            {item.icon}
            <p>{item.title}</p>
            <p>{item.content}</p>
          </Flex>
        ))}
      </Flex>
    </Content>
  );
};

export default index;
