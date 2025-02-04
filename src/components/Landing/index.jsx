import { setUser } from '@/store/slices/userSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Landing = () => {
  let user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem('token');
    // 초기화
    dispatch(setUser({ id: '', username: '', email: '' }));
  };

  return (
    <>
      <div>{user.username || '없음'}님 반가워용</div>
      <button onClick={logout}>로그아웃</button>
      <a href="/login">로그인</a>
    </>
  );
};

export default Landing;
