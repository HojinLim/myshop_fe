import { v4 as uuidv4 } from 'uuid';

const back_url = import.meta.env.VITE_BACK_URL;

const getOrderList = async (user_id, page) => {
  console.log(page);

  try {
    const response = await fetch(`${back_url}/order?userId=${user_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: page }),
    });

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; // ✅ 오류 발생 시 `null` 반환
  }
};
const countOrder = async (userId) => {
  try {
    const response = await fetch(`${back_url}/order/count?userId=${userId}`, {
      headers: { 'Content-Type': 'application/json' },
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

export { getOrderList, countOrder };
