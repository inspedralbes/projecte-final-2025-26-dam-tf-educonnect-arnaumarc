## 1. Backend: Refactorización del Modelo y Tipos

- [x] 1.1 Actualizar `main/backend/src/models/Notification.js` para incluir los nuevos tipos: `MEET_CALL`, `MEET_MESSAGE`, `PROFESSOR_ADVISORY`.
- [x] 1.2 Añadir el campo `priority` (enum: ['LOW', 'HIGH'], default: 'LOW') al esquema de `Notification`.
- [x] 1.3 Asegurar que `senderModel` soporte 'System' y 'Admin' en el esquema de notificaciones.

## 2. Frontend: Actualización del Estado Global (SocketContext)

- [x] 2.1 Actualizar el tipo `NotificationData` en `main/frontend/src/context/SocketContext.tsx` con los nuevos tipos y el campo `priority`.
- [x] 2.2 Modificar la lógica de recepción de eventos de Meet para emitir notificaciones persistentes en lugar de solo toasts temporales.

## 3. Frontend: Refactorización del TablonView

- [x] 3.1 Actualizar la función `getCategorizedFeed` en `TablonView.tsx` para usar la nueva lógica de filtrado basada en tipos y remitentes.
- [x] 3.2 Implementar el resaltado visual para notificaciones de prioridad "Alta" en el feed.
- [x] 3.3 Actualizar el mapeo de iconos en `renderFeedItem` para soportar `Phone`, `MessageCircle` y `GraduationCap`.

## 4. Frontend: Ajustes en el Panel de Notificaciones

- [x] 4.1 Actualizar `getTypeDetails` en `NotificationPanel.tsx` para incluir los estilos y etiquetas de los nuevos tipos.
- [x] 4.2 Asegurar que el indicador de color lateral refleje correctamente el origen (Profesor vs Sistema).

## 5. Pruebas y Validación

- [x] 5.1 Verificar que los mensajes directos y avisos del profesor aparecen en la pestaña "Personal".
- [x] 5.2 Confirmar que las notificaciones institucionales aparecen en la pestaña "General".
- [x] 5.3 Validar que los eventos de Meet generan entradas persistentes en el Tablón.
