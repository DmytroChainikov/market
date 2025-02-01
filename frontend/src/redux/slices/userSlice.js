import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Початковий стан (користувач не залогінений)
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Зберігаємо об'єкт користувача
    },
    clearUser: (state) => {
      state.user = null; // Видаляємо користувача при логауті
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
