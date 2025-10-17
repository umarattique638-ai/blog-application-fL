import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./userService";

const currentUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: currentUser || null,
  success: false,
  error: false,
  message: "",
  loading: false,
};

export const showUser = createAsyncThunk(
  "user/showuser",
  async (id, thunkAPI) => {
    try {
      let response = await userService.showUser(id);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, formData }, thunkAPI) => {
    try {
      let response = await userService.updateUser(id, formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, thunkAPI) => {
    try {
      let response = await userService.deleteUser(id);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
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
      .addCase(showUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(showUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        state.message = action.payload;
      })
      .addCase(showUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        state.message = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.user = null;
        state.message = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { resetUser, resetState } = userSlice.actions;

export default userSlice.reducer;
