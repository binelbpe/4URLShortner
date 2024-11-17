const config = {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    REDIRECT_URL: process.env.REACT_APP_REDIRECT_URL || 'http://localhost:5000',
    AUTH_ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token'
    },
    URL_ENDPOINTS: {
        SHORTEN: '/url/shorten',
        LIST: '/url',
        DELETE: '/url'
    }
};

export default config; 