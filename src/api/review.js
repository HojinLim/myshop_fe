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
      ('시스템 오류 발생.');
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
    return null; //  오류 발생 시 `null` 반환
  }
};
const updateReview = async (reviewId, data, imageFiles) => {
  try {
    const formData = new FormData();

    // 텍스트 데이터 추가
    formData.append('content', data.content);
    formData.append('rating', data.rating);
    formData.append('gender', data.gender);
    formData.append('weight', data.weight);
    formData.append('height', data.height);
    formData.append('deleteImageIds', JSON.stringify(data.deleteImageIds));

    // 이미지 파일들 추가
    imageFiles.forEach((item) => {
      formData.append('reviewImage', item.file); // 다중 파일 허용
    });

    imageFiles; // 콘솔에서 확인
    // 각각의 item이 File 또는 Blob 인스턴스인지 확인

    imageFiles.forEach((file) => {
      file.file instanceof File; // true 나와야 정상
    });

    const response = await fetch(`${back_url}/review/update/${reviewId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`리뷰 수정 실패: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('리뷰 수정 중 오류 발생:', error);
    return null;
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
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};
const getProductReviews = async (userId, productId) => {
  try {
    const response = await fetch(
      `${back_url}/review?userId=${userId}&productId=${productId}`
    );
    if (!response.ok) throw new Error('시스템 오류 발생.');

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; //  오류 발생 시 `null` 반환
  }
};
const countReview = async (userId) => {
  try {
    const response = await fetch(`${back_url}/review/count?userId=${userId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

export {
  uploadReview,
  updateReview,
  getMyReviews,
  deleteReview,
  getProductReviews,
  countReview,
};
