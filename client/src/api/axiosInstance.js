// src/api/axiosInstance.js
import axios from "axios";
import store from "@/store";
import { logoutUser, resetAuthState, resetUser } from "@/feature/authSlice";
import { RouteSignIn } from "@/helper/RouteName";
import { resetUserState } from "@/feature/userSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_BACKEND_AUTH_URL,
  withCredentials: true, // send cookies like access_token
});

// Interceptor: catch 401 errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear Redux state
      store.dispatch(logoutUser());
      store.dispatch(resetUser());
      store.dispatch(resetAuthState());
      store.dispatch(resetUserState());

      // Clear session storage
      sessionStorage.clear();

      // Force redirect to SignIn
      window.location.href = RouteSignIn;
    }

    return Promise.reject(err);
  }
);

export default api;
