import { message } from 'antd';

const back_url = import.meta.env.VITE_BACK_URL;

const searchProduct = async (keyword = '') => {
  try {
    const response = await fetch(`${back_url}/search/${keyword}`);
    const data = await response.json();

    return data;
    if (response.ok) {
      return data;
    } else if (data.message === '키워드가 없습니다') {
      return data;
    } else if (data.message === '검색 결과가 없습니다.') {
      message.error('검색 결과가 없습니다.');
      return data;
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

export { searchProduct };
