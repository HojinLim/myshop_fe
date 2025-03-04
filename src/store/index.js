import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@/store/slices/userSlice';
import loadingSlice from '@/store/slices/loadingSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    loading: loadingSlice,
  },
});
