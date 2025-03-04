import '@/assets/styles/index.css';
import '@/assets/styles/global.scss';
import SignupForm from '@/components/auth/SignupForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeLanding from '@/components/Landing';
import Home from '@/components/Landing/home';
import Mypage from '@/components/Landing/mypage';
import Profile from '@/components/Landing/mypage/profile';
// 어드민
import AdminLanding from '@/components/admin';
import Dashboard from '@/components/admin/dashboard';
import Settings from '@/components/admin/settings';
import Users from '@/components/admin/users';
import Products from '@/components/admin/products';

import LoginForm from '@/components/auth/LoginForm';
import NotFound from '@/components/notfound';

import Category from '@/components/category';

import ProductDetail from '@/components/user/productDetail';

// 결제
import Payment from '@/components/payment';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from './store/slices/userSlice';
import Loading from './components/common/Loading';

function App() {
  const user = useSelector((state) => state.user.data);
  const login = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);
  const loading = useSelector((state) => state.Loading);
  // useEffect(()=>{

  // },[loading])
  return (
    <>
      {loading && <Loading />}
      {/* // 라우터 */}
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
            <Route path="products" element={<Products />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
          </Route>
          {/* 상품 상세 */}
          <Route path="/product/:id" element={<ProductDetail />}></Route>
          {/* 카테고리 */}
          <Route path="/category/:category" element={<Category />}></Route>
          {/* 결제 */}
          <Route path="/payment" element={<Payment />}></Route>

          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
