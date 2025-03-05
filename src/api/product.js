const back_url = import.meta.env.VITE_BACK_URL;

// 상품 조회
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
// 상품 옵션 생성성
const createProductOption = async (options) => {
  try {
    const response = await fetch(`${back_url}/product/create_options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // JSON 형태로 보내기 위해 Content-Type 설정
      },
      body: JSON.stringify(options), // options 객체를 JSON 문자열로 변환
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

export { getProducts, uploadProduct, createProductOption };
