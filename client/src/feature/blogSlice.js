import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import blogService from "./blogService";

const initialState = {
  blogs: [],
  blog: null,
  success: false,
  error: false,
  message: "",
  loading: false,
};

export const addBlog = createAsyncThunk(
  "blog/add-blog",
  async (formData, thunkAPI) => {
    try {
      let response = await blogService.addBlog(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const showBlog = createAsyncThunk(
  "blog/show-blog",
  async (id, thunkAPI) => {
    try {
      let response = await blogService.showBlog(id);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const showallBlog = createAsyncThunk(
  "blog/showall-blog",
  async (_, thunkAPI) => {
    try {
      let response = await blogService.showallBlog();

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/delete-blog",
  async (id, thunkAPI) => {
    try {
      let response = await blogService.deleteBlog(id);
      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/update-blog",
  async ({ id, formData }, thunkAPI) => {
    try {
      let response = await blogService.updateBlog({ id, formData });
      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    resetBlogState: (state) => {
      state.error = false;
      state.success = false;
      state.message = "";
      state.loading = false;
      state.blog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blog = action.payload.data;
        state.message = action.payload;
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.blog = null;
        state.message = action.payload;
      })
      .addCase(showBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(showBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blog = action.payload;
        state.message = action.payload;
      })
      .addCase(showBlog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.blog = null;
        state.message = action.payload;
      })
      .addCase(showallBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(showallBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blogs = action.payload;
        state.message = action.payload;
      })
      .addCase(showallBlog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.blogs = null;
        state.message = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blog = null;
        state.message = action.payload;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.blog = null;
        state.message = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blog = action.payload.data;
        state.message = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.blog = null;
        state.message = action.payload;
      });
  },
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;
