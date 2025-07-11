import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const back_url = import.meta.env.VITE_BACK_URL;

//  비동기 API 요청 (Thunk 사용)
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
        localStorage.removeItem('token');
        throw new Error('유저 정보를 가져오는데 실패했습니다.');
        // return rejectWithValue('토큰 없음');
      }

      return await response.json(); // 성공 시 반환되는 값
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.message); // 실패 시 반환되는 에러 메시지
    }
  }
);

// 초기 상태값
const initialState = {
  data: {
    id: '',
    email: '',
    username: '',
    role: '',
    profileUrl: '',
    points: 0,
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.data = { ...action.payload.data };
    },
    logout: (state) => {
      localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제

      state.data = { ...initialState.data };
    },
    refresh: (state, action) => {
      state.data = { ...action.payload.data };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...action.payload.data };
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        if (action.payload === '토큰 없음') {
          localStorage.removeItem('token');
          state.data = { ...initialState.data };
          // alert('로그인 토큰 시간이 만료됐거나 유효하지 않습니다. ');
        }
      });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
