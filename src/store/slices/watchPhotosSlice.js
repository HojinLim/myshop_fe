import { createSlice } from '@reduxjs/toolkit';

// 초기 상태값
const initialState = {
  watchPhotos: false,
};

const watchPhotosSlice = createSlice({
  name: 'watchPhotos',
  initialState,
  reducers: {
    setWatchPhotos: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = watchPhotosSlice.actions;
export default watchPhotosSlice.reducer;
