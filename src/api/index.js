const back_url = import.meta.env.VITE_BACK_URL;

const token = localStorage.getItem('token');
const fetchUserInfo = async (setUser) => {
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
const getAllUsers = async (setData) => {
  try {
    const response = await fetch(`${back_url}/admin/getAllUsers`);

    if (response.ok) {
      const data = await response.json();
      // 테이블에 필요한 키 설정
      const users = data.users.map((user) => ({ ...user, key: user.id }));
      setData(users);
    } else {
      console.log('시스템 오류 발생생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

export { fetchUserInfo, getAllUsers };
