const back_url = import.meta.env.VITE_BACK_URL;

const uploadReview = async (data) => {
  try {
    const response = await fetch(`${back_url}/review/upload`);

    if (response.ok) {
      const data = await response.json();
      // 테이블에 필요한 키 설정
      const users = data.users.map((user) => ({ ...user, key: user.id }));
      // setData(users);

      return data;
    } else {
      console.log('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

export { uploadReview };
