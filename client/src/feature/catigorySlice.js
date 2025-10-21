import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "./categoryService";

const initialState = {
  catigorys: [],
  catigory: null,
  success: false,
  error: false,
  message: "",
  loading: false,
};

export const addCatigory = createAsyncThunk(
  "catigory/add-catigory",
  async (formData, thunkAPI) => {
    try {
      let response = await categoryService.addCatigory(formData);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const showCatigory = createAsyncThunk(
  "catigory/show-catigory",
  async (id, thunkAPI) => {
    try {
      let response = await categoryService.showCatigory(id);

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const showAllCatigory = createAsyncThunk(
  "catigory/showall-catigory",
  async (_, thunkAPI) => {
    try {
      let response = await categoryService.showAllCatigory();

      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteCatigory = createAsyncThunk(
  "catigory/del-catigory",
  async (id, thunkAPI) => {
    try {
      let response = await categoryService.deleteCatigory(id);
      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCatigory = createAsyncThunk(
  "catigory/update-catigory",
  async ({ id, formData }, thunkAPI) => {
    try {
      let response = await categoryService.updateCatigory({ id, formData });
      console.log(response);
      return response;
    } catch (error) {
      let message =
        error?.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const catigorySlice = createSlice({
  name: "catigory",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.error = false;
      state.success = false;
      state.message = "";
      state.loading = false;
      state.catigory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCatigory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCatigory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.catigory = action.payload.data;
        state.message = action.payload;
      })
      .addCase(addCatigory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.catigory = null;
        state.message = action.payload;
      })
      .addCase(showCatigory.pending, (state) => {
        state.loading = true;
      })
      .addCase(showCatigory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.catigory = action.payload;
        state.message = action.payload;
      })
      .addCase(showCatigory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.catigory = null;
        state.message = action.payload;
      })
      .addCase(showAllCatigory.pending, (state) => {
        state.loading = true;
      })
      .addCase(showAllCatigory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.catigorys = action.payload;
        state.message = action.payload;
      })
      .addCase(showAllCatigory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.catigorys = null;
        state.message = action.payload;
      })
      .addCase(deleteCatigory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCatigory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.catigory = null;
        state.message = action.payload;
      })
      .addCase(deleteCatigory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.catigory = null;
        state.message = action.payload;
      })
      .addCase(updateCatigory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCatigory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.catigory = action.payload.data;
        state.message = action.payload;
      })
      .addCase(updateCatigory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.catigory = null;
        state.message = action.payload;
      });
  },
});

export const { resetCategoryState } = catigorySlice.actions;
export default catigorySlice.reducer;
