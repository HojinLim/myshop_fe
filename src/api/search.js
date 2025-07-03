import { message } from 'antd';

const back_url = import.meta.env.VITE_BACK_URL;

const searchProduct = async (keyword = '') => {
  try {
    const response = await fetch(`${back_url}/search/${keyword}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

export { searchProduct };
