import '@/assets/styles/index.css';
import '@/assets/styles/global.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import SignupForm from '@/components/auth/SignupForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeLanding from '@/components/Landing';
import Home from '@/components/Landing/home';
// 마이페이지
import Mypage from '@/components/Landing/mypage';
import Profile from '@/components/Landing/mypage/Profile';
import Points from '@/components/Landing/mypage/Points';
import MyPageSetting from '@/components/Landing/mypage/Setting';
import OrderList from '@/components/Landing/mypage/OrderList';
import Favorite from '@/components/Landing/mypage/Favorite';
import ReviewList from '@/components/Landing/mypage/ReviewList';
import UploadReview from '@/components/Landing/mypage/UploadReview';
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
import SearchProduct from '@/components/user/SearchProduct';

// 카트
import Cart from '@/components/cart';

// 결제
import Payment from '@/components/payment';
import PaymentSuccess from './components/payment/PaymentSuccess';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from './store/slices/userSlice';
import Loading from './components/common/Loading';
import { message } from 'antd';
import AllReviewPhotos from './components/user/productDetail/AllReviewPhotos';
import PhotoSliderModal from './components/common/PhotoSliderModal';

function App() {
  const dispatch = useDispatch();
  const [_, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  return (
    <>
      {contextHolder}
      <Loading />

      {/* 라우터 */}
      <Router>
        <Routes>
          <Route path="/" element={<HomeLanding />}>
            <Route path="/" element={<Home />} index />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/mypage/profile" element={<Profile />} />
            <Route path="/mypage/Points" element={<Points />} />
            <Route path="/mypage/setting" element={<MyPageSetting />} />
            <Route path="/mypage/orderList" element={<OrderList />} />
            <Route path="/mypage/favorite" element={<Favorite />} />
            <Route path="/mypage/review" element={<ReviewList />} />
            <Route path="/mypage/review/upload" element={<UploadReview />} />
          </Route>
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
          <Route
            path="/product/:id/reviews"
            element={<PhotoSliderModal />}
          ></Route>

          <Route path="/product/grid/:id" element={<AllReviewPhotos />}></Route>
          {/* 카테고리 */}
          <Route path="/category/:category" element={<Category />}></Route>
          {/* 결제 */}
          <Route path="/payment" element={<Payment />}></Route>
          <Route path="/payment_success" element={<PaymentSuccess />}></Route>
          {/* 카트 */}
          <Route path="/cart" element={<Cart />}></Route>
          {/* 검색 */}
          <Route path="/search/:keyword" element={<SearchProduct />}></Route>
          <Route path="/search/*" element={<SearchProduct />}></Route>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
