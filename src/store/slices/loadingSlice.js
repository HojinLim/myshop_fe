import { createSlice } from '@reduxjs/toolkit';

// 초기 상태값
const initialState = {
  loading: true,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
