import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState { token: string | null; userName?: string | null; }
const initialState: AuthState = { token: localStorage.getItem("token") || null, userName: localStorage.getItem("userName") || null };
console.log("Initial auth state:", initialState);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; userName?: string }>) {
      state.token = action.payload.token;
      if (action.payload.userName) state.userName = action.payload.userName;
      localStorage.setItem("token", action.payload.token);
      if (action.payload.userName) localStorage.setItem("userName", action.payload.userName);
    },
    logout(state) {
      state.token = null;
      state.userName = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
