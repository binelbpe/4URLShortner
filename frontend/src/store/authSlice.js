import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData);
            localStorage.setItem('tokens', JSON.stringify({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken
            }));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { refreshToken } = getState().auth;
            await axios.post(`${API_URL}/logout`, { refreshToken });
            localStorage.removeItem('tokens');
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
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
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.userId = null;
                state.accessToken = null;
                state.refreshToken = null;
            });
    }
});

export const { clearError, setTokens } = authSlice.actions;
export default authSlice.reducer; 