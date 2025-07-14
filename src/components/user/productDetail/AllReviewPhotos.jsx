import MenuHeader from '@/components/common/MenuHeader';
import useReview from '@/hooks/useReview';
import { returnBucketUrl } from '@/utils';

import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Notfound from '@/components/notfound';
import { setReview } from '@/store/slices/reviewSlice';

const AllReviewPhotos = () => {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = pathname.split('/').pop();

  const { reviews, reviewPhotos, combinedReviewPhotos, fetchReview } =
    useReview(user.id, id);
  console.log(user);

  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <Content className="w-full">
      <MenuHeader title="포토리뷰 모아보기" />

      {reviewPhotos?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {reviewPhotos.map((photo, idx) => (
            <img
              key={idx}
              src={returnBucketUrl(photo.imageUrl)}
              className="w-full aspect-square object-cover rounded cursor-pointer"
              onClick={() => {
                const productId = location.pathname.split('/').pop();
                navigate(`/product/${productId}/reviews`);
                dispatch(
                  setReview({
                    reviews: combinedReviewPhotos,
                    photos: reviewPhotos,
                    currentIndex: idx,
                  })
                );
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 text-lg">
          등록된 포토 리뷰가 없습니다.
        </div>
      )}
    </Content>
  );
};

export default AllReviewPhotos;
