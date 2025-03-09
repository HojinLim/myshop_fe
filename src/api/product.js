const back_url = import.meta.env.VITE_BACK_URL;

// 상품 조회 (type: 카테고리- 카테고리id에 따른, type: id에 따른)
const getProducts = async (type = '', category = '') => {
  try {
    const response = await fetch(
      `${back_url}/product/products?${type}=${category}`
    );

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

// 상품 업로드
const uploadProduct = async (params) => {
  const files = params.photoUrl;
  console.log(files);

  const formData = new FormData();
  formData.append('product', JSON.stringify(params));
  formData.append('productImages', files); // 파일 직접 추가

  try {
    const response = await fetch(`${back_url}/product/upload_product`, {
      method: 'POST',
      body: formData,
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
// 상품 옵션 생성
const searchProductOption = async (id) => {
  try {
    const response = await fetch(
      `${back_url}/product/search_options?product_id=${id}`
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

export { getProducts, uploadProduct, createProductOption, searchProductOption };
