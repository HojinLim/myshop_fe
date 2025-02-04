import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    email: '',
    username: '',
  },
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
