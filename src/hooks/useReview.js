import { getProductReviews } from '@/api/review';
import { setLoading } from '@/store/slices/loadingSlice';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

const useReview = (userId, productId) => {
  const [reviews, setReviews] = useState({ averageRating: 0, reviews: [] });
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const dispatch = useDispatch();
  const fetchReview = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const res = await getProductReviews(userId, productId);
      setReviews(res);

      const photos = res?.reviews?.flatMap((review) =>
        review.review_images?.map((img) => img.imageUrl)
      );
      setReviewPhotos(photos || []);
    } catch (err) {
      console.error('리뷰 정보를 가져오는 중 오류 발생:', err);
    }
    dispatch(setLoading(false));
  }, [userId, productId]);

  return { reviews, reviewPhotos, fetchReview };
};

export default useReview;
