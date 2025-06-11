const back_url = import.meta.env.VITE_BACK_URL;

const createFavorite = async (userId, productId) => {
  try {
    const response = await fetch(`${back_url}/favorite/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, productId: productId }),
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
const deleteFavorite = async (userId, productId) => {
  try {
    const response = await fetch(`${back_url}/favorite/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, productId: productId }),
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
const myFavorite = async (userId) => {
  try {
    const response = await fetch(`${back_url}/favorite/${userId}`, {
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
const checkFavorite = async (userId, productId) => {
  try {
    const response = await fetch(
      `${back_url}/favorite/check?userId=${userId}&productId=${productId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
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
const countFavorite = async (productId) => {
  try {
    const response = await fetch(
      `${back_url}/favorite/count?productId=${productId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
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

export {
  createFavorite,
  deleteFavorite,
  myFavorite,
  checkFavorite,
  countFavorite,
};
