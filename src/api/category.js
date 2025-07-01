const back_url = import.meta.env.VITE_BACK_URL;

const getCategories = async () => {
  try {
    const response = await fetch(`${back_url}/category/categories`);

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
const updateCategories = async (params) => {
  // 카테고리 목록 (사진 제외)
  const categoryArray = params.filter((category, _) => ({
    id: category.id,
    name: category.name,
  }));

  // 업로드한 사진의 아이디 목록
  const photoIdArray = params
    .filter((category, _) => category.upload_photo)
    .map((item, _) => item.id);

  const formData = new FormData();

  formData.append('categories', JSON.stringify(categoryArray));
  formData.append('categoryIds', JSON.stringify(photoIdArray));

  // 업로드한 사진 목록
  params
    .filter((category) => category.upload_photo)
    .forEach((category) => {
      formData.append('categoryImages', category.upload_photo); // ✅ 개별 추가
    });

  for (const [key, value] of formData.entries()) {
    `Key: ${key}, Value:`, value;
  }

  try {
    const response = await fetch(`${back_url}/category/update_categories`, {
      method: 'POST',
      body: formData,
    });
    formData;

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

export { getCategories, updateCategories };
