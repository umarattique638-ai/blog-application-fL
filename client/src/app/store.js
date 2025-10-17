import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice.js";
import userReducer from "../feature/userSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
