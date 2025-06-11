import { v4 as uuidv4 } from 'uuid';

const back_url = import.meta.env.VITE_BACK_URL;

const getOrderList = async (user_id) => {
  try {
    const response = await fetch(`${back_url}/order?userId=${user_id}`);

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; // ✅ 오류 발생 시 `null` 반환
  }
};

export { getOrderList };
