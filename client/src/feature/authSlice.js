import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const currentUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: currentUser || null,
  success: false,
  error: false,
  message: "",
  loading: false,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      let response = await authService.registerUser(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verificationUser = createAsyncThunk(
  "auth/confirm-verification",
  async (token, thunkAPI) => {
    try {
      let response = await authService.verificationUser(token);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      let response = await authService.loginUser(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      let response = await authService.logoutUser();

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (formData, thunkAPI) => {
    try {
      let response = await authService.forgotPassword(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const otpVerification = createAsyncThunk(
  "auth/otp-verification",
  async (formData, thunkAPI) => {
    try {
      let response = await authService.otpVerification(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (formData, thunkAPI) => {
    try {
      let response = await authService.resetPassword(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/google-login",
  async (formData, thunkAPI) => {
    try {
      let response = await authService.googleLogin(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    resetState: (state) => {
      state.error = false;
      state.success = false;
      state.message = "";
      state.loading = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        state.message = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(verificationUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(verificationUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(verificationUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
        state.message = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(otpVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(otpVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(otpVerification.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
        state.message = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { resetUser, resetState } = authSlice.actions;

export default authSlice.reducer;
