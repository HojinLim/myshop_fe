import React, { useEffect, useState } from 'react';
import { Content } from 'antd/es/layout/layout';
import {
  ContainerTwoTone,
  EditTwoTone,
  HeartTwoTone,
  SmileTwoTone,
} from '@ant-design/icons';
import { Avatar, Flex, Typography } from 'antd';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MenuHeader from '@/components/common/MenuHeader';
import { fetchCartLength } from '@/store/slices/cartSlice';
import { toWon, returnBucketUrl } from '@/utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import { countFavorite } from '@/api/favorite';
import { countReview } from '@/api/review';
import { countOrder } from '@/api/order';
import logo from '/logo.png';

const Index = () => {
  const { Title, Text } = Typography;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.data);
  const { cartNum, loading } = useSelector((state) => state.cart);

  const [profilePic, setProfilePic] = useState(logo);

  const {
    data: reviewCount,
    isLoading: isReviewLoading,
    error: reviewError,
  } = useQuery({
    queryKey: ['countReview'],
    queryFn: () => countReview(user.id),
    enabled: !!user?.id,
  });

  const {
    data: favoriteCount,
    isLoading: isFavoriteLoading,
    error: favoriteError,
  } = useQuery({
    queryKey: ['countFavorite'],
    queryFn: () => countFavorite(user.id),
    enabled: !!user?.id,
  });

  const {
    data: orderCount,
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ['countOrder'],
    queryFn: () => countOrder(user.id),
    enabled: !!user?.id,
  });

  // 유저 정보 없으면 로그인 페이지로 강제 이동
  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // 프로필 사진 설정 (user.profileUrl 안전 체크)
  useEffect(() => {
    if (user?.profileUrl) {
      setProfilePic(returnBucketUrl(user.profileUrl));
    } else {
      setProfilePic(logo);
    }
  }, [user, user?.profileUrl]);

  // 장바구니 개수 redux 상태 동기화
  useEffect(() => {
    dispatch(fetchCartLength());
  }, [dispatch]);

  // 마이페이지 메뉴 항목
  const menuItems = [
    {
      icon: <ContainerTwoTone />,
      title: '주문내역',
      content: orderCount?.count,
      handler: () => {
        navigate('/mypage/orderList');
      },
    },
    {
      icon: <HeartTwoTone />,
      title: '찜목록',
      content: favoriteCount?.count,
      handler: () => {
        navigate('/mypage/favorite');
      },
    },
    {
      icon: <EditTwoTone />,
      title: '리뷰',
      content: reviewCount?.count,
      handler: () => {
        navigate('/mypage/review');
      },
    },
    {
      icon: <SmileTwoTone />,
      title: '포인트',
      content: `${toWon(user?.points ?? 0)}원`,
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
          className={user?.id ? 'cursor-pointer' : ''}
          onClick={() => navigate('/mypage/setting')}
          src={profilePic}
          onError={() => {
            setProfilePic(logo); // 프로필 이미지 로드 실패 시 기본 이미지
            return false; // Ant Design 기본 동작 방지
          }}
        />
        <p className="font-bold ml-2">{user?.username || '비회원'}</p>
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

export default Index;
