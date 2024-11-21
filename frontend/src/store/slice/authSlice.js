import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userData);
      localStorage.setItem(
        "tokens",
        JSON.stringify({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          userId: response.data.userId,
        })
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { refreshToken } = getState().auth;
      await api.post("/auth/logout", { refreshToken });
      localStorage.removeItem("tokens");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/profile/update", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/profile/get");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get profile');
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const tokens = localStorage.getItem('tokens');
      if (!tokens) {
        throw new Error('No tokens found');
      }

      const { accessToken, refreshToken } = JSON.parse(tokens);
      if (!accessToken || !refreshToken) {
        localStorage.removeItem('tokens');
        throw new Error('Invalid tokens');
      }

      try {
        const response = await api.get("/auth/profile/get");
        return { ...response.data, accessToken, refreshToken };
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshResponse = await api.post("/auth/refresh-token", { refreshToken });
            const newTokens = {
              accessToken: refreshResponse.data.accessToken,
              refreshToken: refreshResponse.data.refreshToken,
              userId: refreshResponse.data.userId
            };

            localStorage.setItem('tokens', JSON.stringify(newTokens));
            
            // Get user profile with new token
            const profileResponse = await api.get("/auth/profile/get");
            return { ...profileResponse.data, ...newTokens };
          } catch (refreshError) {
            localStorage.removeItem('tokens');
            throw refreshError;
          }
        }
        throw error;
      }
    } catch (error) {
      localStorage.removeItem('tokens');
      return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')).accessToken : null,
  refreshToken: localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')).refreshToken : null,
  loading: false,
  error: null,
  successMessage: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    resetAuth: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Registration successful! Please login.";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userId = action.payload.userId;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload;
        localStorage.removeItem('tokens');
      });
  },
});

export const { clearError, clearSuccessMessage, setTokens, resetAuth } = authSlice.actions;
export default authSlice.reducer;
