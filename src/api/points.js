import { v4 as uuidv4 } from 'uuid';

const back_url = import.meta.env.VITE_BACK_URL;

const getPoints = async (user_id) => {
  try {
    const response = await fetch(`${back_url}/points/?userId=${user_id}`);

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; // ✅ 오류 발생 시 `null` 반환
  }
};

const updateUserPoints = async (userId, points, reason = '') => {
  try {
    const response = await fetch(`${back_url}/points/change_points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        points,
        reason,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; // ✅ 오류 발생 시 `null` 반환
  }
};

export { getPoints, updateUserPoints };
