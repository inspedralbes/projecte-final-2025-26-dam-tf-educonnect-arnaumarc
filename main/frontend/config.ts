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

    // Development: local backend on 3005 (docker on 3006)
    return `http://${window.location.hostname}:3005`;
};

export const API_BASE_URL = getApiUrl();

const withPort = (host: string, port: number) => `http://${host}:${port}`;

export const getApiCandidates = () => {
    if (import.meta.env.PROD) {
        return [API_BASE_URL];
    }

    const host = window.location.hostname;
    const candidates = [
        API_BASE_URL,
        withPort(host, 3005),
        withPort(host, 3001),
        withPort('localhost', 3005),
        withPort('127.0.0.1', 3005),
        withPort('localhost', 3001),
        withPort('127.0.0.1', 3001),
    ];

    return [...new Set(candidates.map((url) => String(url).replace(/\/$/, '')))];
};
