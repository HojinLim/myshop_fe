const back_url = import.meta.env.VITE_BACK_URL;

const getCategories = async () => {
  try {
    const response = await fetch(`${back_url}/category/categories`);

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

export { getCategories };
