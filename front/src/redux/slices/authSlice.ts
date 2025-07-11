import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string | null;
  role: string | null;
}

const initialState: AuthState = {
  email: null,
  role: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{ email: string; role: string }>
    ) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    logoutUser: (state) => {
      state.email = null;
      state.role = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
