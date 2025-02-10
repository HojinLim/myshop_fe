const back_url = import.meta.env.VITE_BACK_URL;

const fetchUserInfo = async (setUser) => {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const response = await fetch(`${back_url}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();

      setUser(userData);
    } else {
      console.log('토큰이 만료되었거나 유효하지 않습니다.');
    }
  } catch (error) {
    console.error('사용자 정보를 가져오는 중 오류 발생:', error);
  }
};

export { fetchUserInfo };
