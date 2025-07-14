import { getProductReviews } from '@/api/review';
import { setLoading } from '@/store/slices/loadingSlice';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

const useReview = (userId, productId) => {
  const [reviews, setReviews] = useState({ averageRating: 0, reviews: [] });
  const [reviewPhotos, setReviewPhotos] = useState([]);
  // 리뷰 사진과 그와 연관된 리뷰를 포함한 배열
  const [combinedReviewPhotos, setCombinedReviewPhotos] = useState([]);

  const dispatch = useDispatch();
  const fetchReview = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const res = await getProductReviews(userId, productId);
      setReviews(res);

      const photos = res?.reviews?.flatMap((review) => review.review_images);
      setReviewPhotos(photos || []);

      // 리뷰 사진과 그와 연관된 리뷰를 포함한 배열
      const combinedReviewPhotos = photos.map((photo) => {
        const matchedReview = res?.reviews.find(
          (review) => review.id === photo.review_id
        );
        return {
          ...photo,
          review: matchedReview,
        };
      });

      setCombinedReviewPhotos(combinedReviewPhotos);
    } catch (err) {
      console.error('리뷰 정보를 가져오는 중 오류 발생:', err);
    }
    dispatch(setLoading(false));
  }, [userId, productId]);

  return { reviews, reviewPhotos, combinedReviewPhotos, fetchReview };
};

export default useReview;
