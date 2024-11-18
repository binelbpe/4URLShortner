import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const createShortUrl = createAsyncThunk(
  "url/createShortUrl",
  async (urlData, { rejectWithValue }) => {
    try {
      const response = await api.post("/url/shorten", urlData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create short URL"
      );
    }
  }
);

export const fetchUrls = createAsyncThunk(
  "url/fetchUrls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/url");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch URLs"
      );
    }
  }
);

export const deleteUrl = createAsyncThunk(
  "url/deleteUrl",
  async (urlId, { rejectWithValue }) => {
    try {
      await api.delete(`/url/${urlId}`);
      return urlId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete URL"
      );
    }
  }
);

const urlSlice = createSlice({
  name: "url",
  initialState: {
    urls: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShortUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.urls.unshift(action.payload);
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = state.urls.filter((url) => url._id !== action.payload);
      })
      .addCase(deleteUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = urlSlice.actions;
export default urlSlice.reducer;
