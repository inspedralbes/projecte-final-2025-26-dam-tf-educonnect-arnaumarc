/// <reference types="vite/client" />
export const getApiUrl = () => {
    // If we are in production and served by the backend, we use relative paths
    if (import.meta.env.PROD) {
        return 'http://46.224.0.230:3005';
    }
    // In development, we use the server IP to allow cross-device testing
    return 'http://46.224.0.230:3005';
};

export const API_BASE_URL = getApiUrl();
