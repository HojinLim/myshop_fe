import { message } from 'antd';
import axios from 'axios';

const back_url = import.meta.env.VITE_BACK_URL;

// 상품 조회 (type: category, id)
const getProducts = async (type = '', value = '', page = 1) => {
  try {
    const response = await fetch(
      `${back_url}/product?${type}=${value}&page=${page}`
    );
    if (!response.ok) throw new Error('시스템 오류 발생.');

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; //  오류 발생 시 `null` 반환
  }
};

// 상품 업로드
const uploadProduct = async (params) => {
  const { mainFiles, detailFiles } = params || {};
  const formData = new FormData();

  'mainFiles:', mainFiles;
  'detailFiles:', detailFiles;

  //  메인 파일 추가
  (mainFiles || []).forEach((fileObj, index) => {
    const file = fileObj.originFileObj;
    if (!(file instanceof File)) {
      console.error(` 메인 파일이 아님 (index: ${index}):`, file);
      return;
    }
    formData.append('mainImages', file);
  });

  //  디테일 파일 추가
  (detailFiles || []).forEach((fileObj, index) => {
    const file = fileObj.originFileObj;
    if (!(file instanceof File)) {
      console.error(` 디테일 파일이 아님 (index: ${index}):`, file);
      return;
    }
    formData.append('detailImages', file);
  });

  //  상품 정보 추가
  formData.append('product', JSON.stringify(params));

  '업로드할 FormData:', [...formData.entries()];

  try {
    const response = await fetch(`${back_url}/product/upload_product`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    '업로드 결과:', result;
    return result;
  } catch (error) {
    console.error(' 업로드 실패:', error);
    throw error;
  }
};
// 상품 삭제
const deleteProduct = async (id) => {
  try {
    const response = await fetch(
      `${back_url}/product/delete_product?product_id=${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    '삭제 결과:', result;

    if (result?.error?.name === 'SequelizeForeignKeyConstraintError') {
      message.warning('해당 제품 옵션부터 삭제바랍니다.');
    }

    return result;
  } catch (error) {
    console.error('⚠️ 오류 발생:', error.message); // 에러 로그 출력
    throw error; // 에러를 다시 던져서 상위 함수에서 처리할 수 있게 함
  }
};

// 상품 옵션 생성
const createProductOption = async (options) => {
  try {
    const response = await fetch(`${back_url}/product/create_options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('⚠️ 오류 발생:', error.message); // 에러 로그 출력
    throw error; // 에러를 다시 던져서 상위 함수에서 처리할 수 있게 함
  }
};
// 상품 옵션 조회
const getProductOption = async (id) => {
  try {
    const response = await axios(
      `${back_url}/product/product_options?product_id=${id}`
    );

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
    // }

    return await response.data;
  } catch (error) {
    // console.error('⚠️ 오류 발생:', error.message); // 에러 로그 출력
    throw error; // 에러를 다시 던져서 상위 함수에서 처리할 수 있게 함
  }
};
// 상품 옵션 업데이트
const updateProductOption = async (options) => {
  try {
    const response = await fetch(`${back_url}/product/update_options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('⚠️ 오류 발생:', error.message); // 에러 로그 출력
    throw error; // 에러를 다시 던져서 상위 함수에서 처리할 수 있게 함
  }
};
// 상품 옵션 삭제
const deleteProductOptions = async (id) => {
  try {
    const response = await fetch(
      `${back_url}/product/delete_product_options?product_id=${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('⚠️ 오류 발생:', error.message); // 에러 로그 출력
    throw error; // 에러를 다시 던져서 상위 함수에서 처리할 수 있게 함
  }
};

// 상품 사진 업데이트
const updateProductPhoto = async (productId, images, deleteImageIds) => {
  try {
    const formData = new FormData();

    formData.append('deleteImageIds', JSON.stringify(deleteImageIds));

    //  메인 파일 추가
    (images.main || []).forEach((fileObj, index) => {
      const file = fileObj?.file;
      if (!(file instanceof File)) return;

      formData.append('mainImages', file);
    });

    //  디테일 파일 추가
    (images.detail || []).forEach((fileObj, index) => {
      const file = fileObj?.file;
      if (!(file instanceof File)) return;

      formData.append('detailImages', file);
    });

    const response = await fetch(
      `${back_url}/product/update_photo/${productId}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`상품 사진 수정 실패: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('상품 사진 수정 중 오류 발생:', error);
    return null;
  }
};

export {
  getProducts,
  uploadProduct,
  deleteProduct,
  createProductOption,
  getProductOption,
  updateProductOption,
  deleteProductOptions,
  updateProductPhoto,
};
