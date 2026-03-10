import { Platform } from 'react-native';

/**
 * INSTRUCCIONES PARA EL DESARROLLADOR:
 * 
 * 1. Si usas el EMULADOR DE ANDROID: '10.0.2.2' es la IP correcta para acceder al localhost de tu PC.
 * 2. Si usas el EMULADOR DE IOS: 'localhost' suele funcionar.
 * 3. Si usas un DISPOSITIVO FÍSICO (Expo Go): DEBES poner la IP local de tu ordenador (ej: '192.168.1.XX').
 *    Asegúrate de que el móvil y el PC estén en la misma red Wi-Fi.
 */

const LOCAL_IP = '10.0.2.2'; // Cambia esto por tu IP local si usas un móvil real

export const API_BASE_URL = Platform.select({
    ios: `http://localhost:3005`,
    android: `http://${LOCAL_IP}:3005`,
    default: `http://localhost:3005`,
});
