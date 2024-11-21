import axios from "axios";
import { store } from "../store/store";
import { setTokens, resetAuth } from "../store/slice/authSlice";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    (config) => {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            const { accessToken } = JSON.parse(tokens);
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokens = localStorage.getItem('tokens');
                if (!tokens) {
                    throw new Error('No tokens available');
                }

                const { refreshToken } = JSON.parse(tokens);
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
                    { refreshToken }
                );

                const newTokens = {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    userId: response.data.userId
                };
                
                localStorage.setItem('tokens', JSON.stringify(newTokens));
                store.dispatch(setTokens(newTokens));

                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(resetAuth());
                localStorage.removeItem('tokens');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
