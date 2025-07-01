import { v4 as uuidv4 } from 'uuid';

const back_url = import.meta.env.VITE_BACK_URL;

const addCart = async (params) => {
  try {
    const response = await fetch(`${back_url}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
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

const getCarts = async (user_id) => {
  try {
    const response = await fetch(`${back_url}/cart/?user_id=${user_id}`);

    return await response.json();
  } catch (error) {
    console.error('오류 발생:', error);
    return null; // ✅ 오류 발생 시 `null` 반환
  }
};
const updateCartQuantity = async (params) => {
  try {
    const response = await fetch(`${back_url}/cart/update_quantity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
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
const updateCartOption = async (params) => {
  try {
    const response = await fetch(`${back_url}/cart/update_option`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
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
// 비회원 카트 정회원으로 옮기기
const transferCart = async (params) => {
  try {
    const response = await fetch(`${back_url}/cart/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
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

// 카트 삭제
const deleteCart = async (id) => {
  id;

  try {
    const response = await fetch(`${back_url}/cart/delete?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    '삭제 결과:', result;
    return result;
  } catch (error) {
    console.error('⚠️ 오류 발생:', error.message); // 에러 로그 출력
    throw error; // 에러를 다시 던져서 상위 함수에서 처리할 수 있게 함
  }
};

export {
  addCart,
  getCarts,
  updateCartQuantity,
  updateCartOption,
  transferCart,
  deleteCart,
};
