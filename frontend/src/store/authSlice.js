import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  user: null, // Store user data if needed
  token: null, // Store the JWT token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginSuccess, (state, action) => {
      // console.log("loginSuccess action:", action.payload);
    });
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;