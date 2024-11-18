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
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/profile", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.accessToken) {
        return rejectWithValue('No access token');
      }

      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('tokens');
      }
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

const initialState = {
  userId: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
  successMessage: null,
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
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Registration successful! Please login to continue.";
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
        state.userId = action.payload.userId;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "An error occurred during login";
      })
      .addCase(logout.fulfilled, (state) => {
        state.userId = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Profile updated successfully';
        if (action.payload.email) {
          state.user = { ...state.user, email: action.payload.email };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null;
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
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, setTokens, resetAuth } = authSlice.actions;
export default authSlice.reducer;
