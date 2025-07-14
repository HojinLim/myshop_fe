import { createSlice } from '@reduxjs/toolkit';

// 초기 상태값
const initialState = {
  data: {
    open: false,
    reviews: [],
    photos: [],
    currentIndex: 0,
  },
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReview: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setReview } = reviewSlice.actions;
export const reviewInitialState = initialState;
export default reviewSlice.reducer;
