const back_url = import.meta.env.VITE_BACK_URL;

// 리뷰 좋아요 생성
const createReviewLike = async (userId, reviewId) => {
  try {
    const response = await fetch(`${back_url}/review_like/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reviewId }),
      // body: JSON.stringify({ userId, reviewId }),
    });

    if (response.ok) {
      return response;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

// 리뷰 좋아요 삭제
const deleteReviewLike = async (userId, reviewId) => {
  userId, reviewId;

  try {
    const response = await fetch(
      `${back_url}/review_like/delete?userId=${userId}&reviewId=${reviewId}`,
      {
        method: 'DELETE',
      }
    );

    if (response.ok) {
      return response;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};
// 리뷰 좋아요 체크
const checkReviewLike = async (userId, reviewId) => {
  try {
    const response = await fetch(`${back_url}/review_like/check`, {
      body: JSON.stringify({ userId, reviewId }),
    });

    if (response.ok) {
      return response;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

// 리뷰 좋아요 개수 조회
const countReviewLike = async (reviewId) => {
  try {
    const response = await fetch(`${back_url}/review_like/${reviewId}`);

    if (response.ok) {
      return response;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

export { createReviewLike, deleteReviewLike, checkReviewLike, countReviewLike };
