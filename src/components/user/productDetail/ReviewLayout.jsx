import React, { useEffect, useState } from 'react';
import {
  LikeFilled,
  StarFilled,
  StarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { getProductReviews } from '@/api/review';
import styles from './index.module.css';
import { Divider, Flex, Modal, Rate } from 'antd';
import { anonymizeNickname, returnBucketUrl } from '@/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from '@/utils/dayjs';

import NotFound from '@/components/notfound';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  countReviewLike,
  createReviewLike,
  deleteReviewLike,
} from '@/api/reviewLike';
import { useSelector } from 'react-redux';
const ReviewLayout = (props) => {
  const { fetchReview, reviews } = props;
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.data);

  const { mutate: mutateCreateReviewLike, isSuccess: reviewLikeSuccess } =
    useMutation({
      mutationFn: ({ userId, reviewId }) => createReviewLike(userId, reviewId),
    });

  useEffect(() => {
    fetchReview();
  }, [reviewLikeSuccess]);

  const clickReviewLikeHandler = async (review) => {
    if (review.isLiked) {
      await deleteReviewLike(user.id, review.id)
        .then(() => {
          fetchReview();
        })
        .catch(() => {});
    } else {
      mutateCreateReviewLike({
        userId: user.id,
        reviewId: review.id,
      });
    }
  };

  return (
    <Content className={styles.review_layout}>
      <Flex>
        <p className="font-bold">전체 {reviews?.reviews?.length}개</p>
        <Rate
          value={reviews?.averageRating}
          className="!mx-3"
          disabled={true}
        />
        <p className="font-bold">{Number(reviews?.averageRating) || ''}</p>
      </Flex>
      <Flex className="!my-3 gap-3">
        {reviews?.reviews
          ?.flatMap((review) =>
            review.review_images?.map((img) => img.imageUrl)
          ) // URL 배열로 평탄화
          ?.slice(0, 8) // 최대 8장까지만 자름
          ?.map((imgUrl, idx) => (
            <div
              key={idx}
              className="aspect-square w-24 overflow-hidden rounded-xl content-center cursor-pointer"
              onClick={() => {}}
            >
              <img src={returnBucketUrl(imgUrl)} />
            </div>
          ))}
      </Flex>

      <hr className="divider_bold" />
      <Flex vertical>
        {reviews?.reviews.length <= 0 && (
          <NotFound title="등록된 리뷰가 없습니다" subTitle=" " type="noBtn" />
        )}
        {reviews?.reviews?.map((review, idx) => (
          <div key={idx}>
            <Flex justify="space-between">
              <p>
                {anonymizeNickname(review.User.username)} |{' '}
                {dayjs(review.createdAt).format('YYYY.MM.DD')}
              </p>
              <div
                className={`flex gap-2 ${
                  review.isLiked ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <p>{review.likeCount}</p>

                <LikeFilled
                  onClick={() => {
                    if (!user?.id) {
                      navigate('/login');
                    } else {
                      clickReviewLikeHandler(review);
                    }
                  }}
                />
              </div>
            </Flex>
            <Flex>
              {review?.review_images.map((image, idx) => (
                <div
                  key={idx}
                  className="aspect-square w-24 overflow-hidden rounded-xl content-center my-3 !mr-3"
                >
                  <img src={returnBucketUrl(image.imageUrl)} />
                </div>
              ))}
            </Flex>
            <Rate value={review?.rating} className="!mx-3" disabled={true} />
            <p className="!my-3">{review.content}</p>
            {review.weight && review.height && (
              <Flex>
                {/* <p className="mr-3 text-gray-400">체형·평소 사이즈</p>
              <p>176cm | 83kg | 105</p> */}
                <p className="mr-3 text-gray-400">체형</p>
                <p>
                  {review.height}cm | {review.weight}kg
                </p>
              </Flex>
            )}
            <Flex>
              <p className="mr-3 text-gray-400">상품 구매 옵션</p>
              <p>
                {review.product_option.color} | {review.product_option.size}
              </p>
            </Flex>
            <Divider />
          </div>
        ))}
      </Flex>
    </Content>
  );
};

export default ReviewLayout;
