import axios from "axios";
import { store } from "../store/store";
import { setTokens } from "../store/slice/authSlice";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const refreshToken = state.auth.refreshToken;

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                store.dispatch(
                    setTokens({ 
                        accessToken, 
                        refreshToken: newRefreshToken,
                        isAuthenticated: true 
                    })
                );

                localStorage.setItem('tokens', JSON.stringify({
                    accessToken,
                    refreshToken: newRefreshToken
                }));

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('tokens');
                store.dispatch(setTokens({ 
                    accessToken: null, 
                    refreshToken: null,
                    isAuthenticated: false 
                }));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
