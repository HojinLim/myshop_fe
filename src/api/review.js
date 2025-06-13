const back_url = import.meta.env.VITE_BACK_URL;

const uploadReview = async (userData, images) => {
  const formData = new FormData();

  // 유저 데이터도 formData에 하나씩 추가
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // 이미지도 추가
  if (Array.isArray(images) && images.length > 0) {
    images.forEach((item) => {
      formData.append('reviewImage', item.file);
    });
  }

  try {
    const response = await fetch(`${back_url}/review/create`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return response;
    } else {
      console.log('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};
const getMyReviews = async (userId) => {
  try {
    const response = await fetch(`${back_url}/review/me/${userId}`);

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; // ✅ 오류 발생 시 `null` 반환
  }
};

const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${back_url}/review/delete/${reviewId}`, {
      method: 'DELETE',
      // headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      console.log('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};
const getProductReviews = async (productId) => {
  try {
    const response = await fetch(`${back_url}/review/${productId}`);
    if (!response.ok) throw new Error('시스템 오류 발생.');

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; // ✅ 오류 발생 시 `null` 반환
  }
};

export { uploadReview, getMyReviews, deleteReview, getProductReviews };
