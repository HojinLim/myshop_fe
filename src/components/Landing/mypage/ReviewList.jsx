import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import MenuHeader from '@/components/common/MenuHeader';
import { Divider, Flex, Rate } from 'antd';
import { EllipsisOutlined, HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { deleteReview, getMyReviews } from '@/api/review';
import dayjs from '@/utils/dayjs';
import { returnBucketUrl } from '@/utils';
import MenuDrawer from '@/components/common/MenuDrawer';
import Item from 'antd/es/list/Item';
import { useNavigate } from 'react-router-dom';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const user = useSelector((state) => state.user.data);
  const navigate = useNavigate();
  const fetchMyReviews = async () => {
    await getMyReviews(user.id)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setReviews(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchMyReviews();
  }, [user]);

  const deleteReviewHandler = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      fetchMyReviews();
      alert('리뷰가 삭제되었습니다.');
    } catch (err) {
      alert('삭제 중 오류 발생');
      console.error(err);
    }
  };
  const moveToUploadReviewHandler = (review) => {
    console.log(review);

    const newData = {
      ...review,
      product_option: { ...review.product_option, Product: review.Product },
      type: 'update',
    };

    navigate('/mypage/review/upload', { state: newData });
  };

  return (
    <Content>
      <MenuHeader title="후기" />
      <Flex vertical>
        {/* 리뷰 아이템 */}
        {reviews.map((review, index) => (
          <div key={index} className="!mb-2">
            <Flex justify="space-between">
              <div className="flex">
                <Rate allowClear={false} disabled value={review.rating} />
                <p className="ml-2">{dayjs(review.createdAt).fromNow()}</p>
              </div>
              <MenuDrawer
                menuItems={[
                  {
                    text: '수정하기',
                    handler: () => moveToUploadReviewHandler(review),
                  },
                  {
                    text: '삭제하기',
                    handler: () => deleteReviewHandler(review.id), // reviewId는 해당 리뷰의 ID
                  },
                ]}
              />
            </Flex>
            <div className="flex">
              <div className="aspect-square overflow-hidden w-24">
                <img
                  src={returnBucketUrl(
                    review.Product.ProductImages[0].imageUrl
                  )}
                />
              </div>
              <Flex vertical justify="flex-end" className="!p-2">
                <p>{review.Product.name}</p>
                <p className="text-gray-500">
                  {`${review.product_option.color} · ${
                    review.product_option.size
                  } |
                  ${dayjs(review.createdAt).format('YYYY.MM.DD')} 구매확정`}
                </p>
              </Flex>
            </div>
            <p>{review.content}</p>
            <div className="flex gap-1 !mt-2">
              <HeartOutlined />0
            </div>
            <Flex className="!mt-3 gap-1.5">
              {review.review_images &&
                review.review_images.map((photo, idx) => (
                  <div
                    key={idx}
                    className="aspect-square overflow-hidden w-24 place-content-center"
                  >
                    <img src={returnBucketUrl(photo.imageUrl)} />
                  </div>
                ))}
            </Flex>
            <Divider />
          </div>
        ))}
      </Flex>
    </Content>
  );
};

export default ReviewList;
