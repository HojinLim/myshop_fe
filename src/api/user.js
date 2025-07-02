const back_url = import.meta.env.VITE_BACK_URL;

const getAllUsers = async () => {
  try {
    const response = await fetch(`${back_url}/admin/getAllUsers`);

    if (response.ok) {
      const data = await response.json();
      // 테이블에 필요한 키 설정
      const users = data.users.map((user) => ({ ...user, key: user.id }));
      // setData(users);

      return data;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};
// 프로필 이미지 업로드
const uploadProfileImage = async (file, uid) => {
  if (!file) {
    alert('이미지를 선택하세요.');
    return;
  }

  const formData = new FormData();
  formData.append('userId', uid);
  formData.append('customName', uid);
  formData.append('profile', file);

  try {
    const response = await fetch(`${back_url}/auth/upload?userId=${uid}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

// 프로필 이미지 삭제
const deleteProfileImage = async (uid) => {
  try {
    const response = await fetch(`${back_url}/auth/delete_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: uid }), // userId를 서버로 전송
    });

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      ('시스템 오류 발생.');
    }
  } catch (error) {
    console.error(' 오류 발생:', error);
  }
};

export { getAllUsers, uploadProfileImage, deleteProfileImage };
