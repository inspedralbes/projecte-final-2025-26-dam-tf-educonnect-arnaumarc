import { Platform } from 'react-native';

/**
 * INSTRUCCIONES PARA EL DESARROLLADOR:
 * 
 * 1. Si usas el EMULADOR DE ANDROID: '10.0.2.2' es la IP correcta para acceder al localhost de tu PC.
 * 2. Si usas el EMULADOR DE IOS: 'localhost' suele funcionar.
 * 3. Si usas un DISPOSITIVO FÍSICO (Expo Go): DEBES poner la IP local de tu ordenador (ej: '192.168.1.XX').
 *    Asegúrate de que el móvil y el PC estén en la misma red Wi-Fi.
 */

const SERVER_IP = '46.224.0.230';

export const API_BASE_URL = `http://${SERVER_IP}:3005`;
