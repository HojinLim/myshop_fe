import React, { useEffect, useState } from 'react';

import styles from './index.module.css';
import { Content } from 'antd/es/layout/layout';
import {
  FrownTwoTone,
  HeartFilled,
  HeartOutlined,
  HeartTwoTone,
  SettingOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { createFavorite, deleteFavorite, myFavorite } from '@/api/favorite';
import MenuHeader from '@/components/common/MenuHeader';
import { Badge, Button, Flex, Popconfirm, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { discountPercent, returnBucketUrl } from '@/utils';
import { fetchCartLength } from '@/store/slices/cartSlice';

const Favorite = () => {
  const user = useSelector((state) => state.user.data);
  // redux로 카트 정보 가져오기
  const { cartNum, loading, error } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]);

  if (!user.id) navigate('/login');

  useEffect(() => {
    dispatch(fetchCartLength()); // ✅ 비동기 API 호출
  }, [dispatch]);

  const fetchMyFavorite = async () => {
    await myFavorite(user.id)
      .then((res) => {
        console.log(res);
        setFavorites(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const clickFavorite = async (product) => {
    const isDeleted = product.delete;
    const productId = product.Product.id;
    if (!isDeleted) {
      // 좋아요 취소
      await deleteFavorite(user.id, productId)
        .then((res) => {
          setFavorites((prev) =>
            prev.map((item) =>
              item.Product.id === productId ? { ...item, delete: true } : item
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // 좋아요 추가
      await createFavorite(user.id, productId)
        .then((res) => {
          setFavorites((prev) =>
            prev.map((item) =>
              item.Product.id === productId ? { ...item, delete: false } : item
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchMyFavorite();
  }, []);

  return (
    <Content>
      <MenuHeader title="찜" />
      <p className="!mb-3">상품 {favorites.length}개</p>
      {favorites.length <= 0 && (
        <Result icon={<FrownTwoTone />} title="찜한 상품이 없습니다" />
      )}
      {/* 찜 상품 배열 */}

      {/* <Flex className="flex-wrap !px-8  gap-x-4 gap-y-6"> */}
      <Flex className="!grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
        {/* 찜 상품 낱개 */}
        {favorites.map((product, index) => (
          <div key={index} className="flex flex-col mr-4 mb-4 cursor-pointer">
            <div
              className="aspect-square overflow-hidden rounded-xl w-32 relative"
              onClick={(event) => {
                event.stopPropagation(); // 부모 div의 onClick 방지
                navigate(`/product/${product.Product.id}`);
              }}
            >
              <img
                src={
                  product?.Product?.ProductImages[0]
                    ? returnBucketUrl(
                        product?.Product?.ProductImages[0]?.imageUrl
                      )
                    : '/logo.png'
                }
                alt={product.Product.name}
                className="w-full h-full object-cover"
              />
              <Popconfirm
                title={`${
                  product.delete
                    ? '찜 목록에 다시 추가합니까?'
                    : '찜 목록에서 삭제합니까?'
                }`}
                onConfirm={(event) => {
                  event.stopPropagation(); // 부모 div의 onClick 방지
                  clickFavorite(product);
                }}
                onCancel={(event) => {
                  event.stopPropagation();
                }}
              >
                <div
                  className="text-red-500 absolute top-0 right-0 p-2 cursor-pointer"
                  onClick={(event) => event.stopPropagation()}
                >
                  {product.delete ? <HeartOutlined /> : <HeartFilled />}
                </div>
              </Popconfirm>
            </div>
            <Flex>
              <p className="mr-2 font-bold text-red-500">
                {discountPercent(
                  product.Product.originPrice,
                  product.Product.discountPrice
                )}
                %
              </p>
              <p className="font-bold">
                {Number(product.Product.discountPrice).toLocaleString()}원
              </p>
            </Flex>
            <p>{product.Product.name}</p>
          </div>
        ))}
      </Flex>
    </Content>
  );
};

export default Favorite;
