import { Platform } from 'react-native';

/**
 * INSTRUCCIONS (DEV):
 * - Android Emulator: usa '10.0.2.2' per accedir al localhost del PC.
 * - iOS Simulator: normalment 'localhost' funciona.
 * - Dispositiu físic (Expo Go): posa la IP local del teu ordinador (ex: '192.168.1.50') i assegura't que és a la mateixa Wi‑Fi.
 *
 * PRODUCCIÓ:
 * - Per defecte apunta al domini públic.
 * - Pots sobreescriure-ho amb EXPO_PUBLIC_API_BASE_URL (EAS/Expo).
 */

const DEFAULT_PROD_API_BASE_URL = 'https://projecteeduconnect.cat';

// Expo only exposes env vars prefixed with EXPO_PUBLIC_
const envUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || '').trim();

// If you need local dev without env vars, you can temporarily set this:
// const DEV_SERVER = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
// export const API_BASE_URL = `http://${DEV_SERVER}:3006`;

export const API_BASE_URL = (envUrl || DEFAULT_PROD_API_BASE_URL).replace(/\/$/, '');
