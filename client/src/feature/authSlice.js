import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  success: false,
  error: false,
  message: "",
  loading: false,
};

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.registerUser(formData);
      console.log("✅ Register response:", response);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verification User
export const verificationUser = createAsyncThunk(
  "auth/confirm-verification",
  async (token, thunkAPI) => {
    try {
      const response = await authService.verificationUser(token);
      console.log("✅ Verification response:", response);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.loginUser(formData);
      console.log("✅ Login response:", response);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await authService.logoutUser();
      console.log("✅ Logout response:", response);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(formData);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// OTP Verification
export const otpVerification = createAsyncThunk(
  "auth/otp-verification",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.otpVerification(formData);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.resetPassword(formData);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Google Login
export const googleLogin = createAsyncThunk(
  "auth/google-login",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.googleLogin(formData);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Auth Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
      state.success = false;
      state.error = false;
      state.message = "";
    },
    resetState: (state) => {
      state.error = false;
      state.success = false;
      state.message = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.message = action.payload || "Registration failed";
      })

      // Verification User
      .addCase(verificationUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(verificationUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Verification successful";
      })
      .addCase(verificationUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload || "Verification failed";
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user.user; // <-- Save the actual user object here
        state.accessToken = action.payload.user.accessToken; // optional, if you want to save token in state
        state.refreshToken = action.payload.user.refreshToken;
        state.message = action.payload.message || "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.user = null;
        state.message = action.payload || "Login failed";
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.message = action.payload?.message || "Logout successful";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload || "Logout failed";
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "OTP sent successfully";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload || "Failed to send OTP";
      })

      // OTP Verification
      .addCase(otpVerification.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(otpVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "OTP verified";
      })
      .addCase(otpVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload || "OTP verification failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Password reset successful";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload || "Password reset failed";
      })

      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.data || action.payload;
        state.message = action.payload?.message || "Google login successful";
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.user = null;
        state.message = action.payload || "Google login failed";
      });
  },
});

export const { resetUser, resetState, setUser } = authSlice.actions;
export default authSlice.reducer;
