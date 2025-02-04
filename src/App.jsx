import '@/assets/styles/index.css';
import '@/assets/styles/global.scss';
import SignupForm from '@/components/auth/SignupForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '@/components/Landing';
import LoginForm from './components/auth/LoginForm';
import { useEffect, useState } from 'react';
import { fetchUserInfo } from './api';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/userSlice';

function App() {
  const [user, setMyser] = useState(null);
  const myUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(myUser);

  useEffect(() => {
    fetchUserInfo(setMyser);
  }, []);

  useEffect(() => {
    dispatch(setUser(user));
  }, [user]);

  return (
    // 라우터
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
