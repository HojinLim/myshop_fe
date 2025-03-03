const back_url = import.meta.env.VITE_BACK_URL;

const uploadProduct = async (params) => {
  const files = params.photoUrl;
  console.log(files);

  const formData = new FormData();
  formData.append('product', JSON.stringify(params));
  // if (files && files.length > 0) {
  //   files.forEach((file) => {
  //     formData.append('productImages', file); // 파일 직접 추가
  //   });
  // }

  formData.append('productImages', JSON.stringify(files)); // 파일 직접 추가
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

export { uploadProduct };
