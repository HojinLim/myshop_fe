import MenuHeader from '@/components/common/MenuHeader';
import useReview from '@/hooks/useReview';
import { returnBucketUrl } from '@/utils';

import { Content } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Notfound from '@/components/notfound';

const AllReviewPhotos = () => {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user.data);
  const id = pathname.split('/').pop();

  const { reviews, reviewPhotos, fetchReview } = useReview(user.id, id);

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
              src={returnBucketUrl(photo)}
              className="w-full aspect-square object-cover rounded cursor-pointer"
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
