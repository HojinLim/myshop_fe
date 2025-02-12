import '@/assets/styles/index.css';
import '@/assets/styles/global.scss';
import SignupForm from '@/components/auth/SignupForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import HomeLanding from '@/components/Landing';
import Home from '@/components/Landing/home';
import Mypage from '@/components/Landing/mypage';
import Profile from '@/components/Landing/mypage/profile';
import AdminLanding from '@/components/admin';
import Dashboard from '@/components/admin/dashboard';
import Settings from '@/components/admin/settings';
import Users from '@/components/admin/users';
import LoginForm from '@/components/auth/LoginForm';
import NotFound from '@/components/notfound';

import { useEffect, useState } from 'react';
import { fetchUserInfo } from './api';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/slices/userSlice';

function App() {
  const [user, setMyUser] = useState(null);

  const myUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserInfo(setMyUser);
  }, [window.location.href]);

  useEffect(() => {
    dispatch(setUser(user));
  }, [user]);

  return (
    // 라우터
    <Router>
      <Routes>
        <Route path="/" element={<HomeLanding />}>
          <Route path="/" element={<Home />} index />
          <Route path="/mypage" element={<Mypage />} />

          <Route path="/mypage/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        {/* 어드민 부모 라우터*/}
        <Route path="/admin" element={<AdminLanding />}>
          {/* 어드민 자식 라우터*/}
          <Route path="dashboard" element={<Dashboard />} index />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
