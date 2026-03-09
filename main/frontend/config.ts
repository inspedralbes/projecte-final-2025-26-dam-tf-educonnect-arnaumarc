export const getApiUrl = () => {
    // If we are in production and served by the backend, we use relative paths
    if (import.meta.env.PROD) {
        return '';
    }
    // In development, we use the local backend URL
    return 'http://localhost:3005';
};

export const API_BASE_URL = getApiUrl();
