/// <reference types="vite/client" />

const DEFAULT_PROD_ORIGIN = 'https://projecteeduconnect.cat';

export const getApiUrl = () => {
    // Optional override for dev/prod builds
    const fromEnv = import.meta.env.VITE_API_BASE_URL;
    if (fromEnv) return String(fromEnv).replace(/\/$/, '');

    // Production: same-origin (recommended behind reverse proxy)
    if (import.meta.env.PROD) {
        return (typeof window !== 'undefined' && window.location?.origin)
            ? window.location.origin
            : DEFAULT_PROD_ORIGIN;
    }

    // Development: backend docker-compose exposes the API on 3006 by default
    return `http://${window.location.hostname}:3006`;
};

export const API_BASE_URL = getApiUrl();
