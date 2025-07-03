import { getCarts } from '@/api/cart';
import { getNonMemberId } from '@/utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//  비동기 API 호출: 카트 개수 가져오기
export const fetchCartLength = createAsyncThunk(
  'cart/fetchCartLength',
  async (_, { getState, rejectWithValue }) => {
    try {
      //  Redux에서 현재 userId 가져오기
      const state = getState();
      const userId = state.user.data?.id || getNonMemberId();

      const response = await getCarts(userId);

      if (!response.cartItems) return rejectWithValue('카트 데이터 없음');

      return response.cartItems.length;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cartNum: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartLength.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartLength.fulfilled, (state, action) => {
        state.loading = false;
        state.cartNum = action.payload;
      })
      .addCase(fetchCartLength.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
