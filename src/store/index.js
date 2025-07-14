import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@/store/slices/userSlice';
import loadingSlice from '@/store/slices/loadingSlice';
import cartSlice from '@/store/slices/cartSlice';
import reviewSlice from '@/store/slices/reviewSlice';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

//  'user' 상태만 Persist 적용
const persistConfig = {
  key: 'user',
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userSlice); //  persistReducer 적용!

const store = configureStore({
  reducer: {
    user: persistedUserReducer, //  Persist 적용된 userReducer
    loading: loadingSlice,
    cart: cartSlice,
    reviews: reviewSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //  직렬화 검사 비활성화
    }),
});

export const persistor = persistStore(store);
export default store;
