import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
const back_url = import.meta.env.VITE_BACK_URL;

// ✅ 비동기 API 요청 (Thunk 사용)
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo', // 액션 타입 (user/fetchUserInfo)
  async (param, { rejectWithValue }) => {
    // param은 여기에 전달된 인자값
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('토큰 없음');

      const response = await fetch(`${back_url}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('유저 정보를 가져오는데 실패했습니다.');
      }

      return await response.json(); // 성공 시 반환되는 값
    } catch (error) {
      return rejectWithValue(error.message); // 실패 시 반환되는 에러 메시지
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {
      id: '',
      email: '',
      username: '',
      role: '',
    },
    loading: false,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제

      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
