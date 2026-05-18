## 1. Backend: Notificaciones Polimórficas

- [x] 1.1 Modificar `messageController.js` para usar `receiverModel` de la request al crear la notificación en lugar de un valor hardcoded.
- [x] 1.2 Asegurar que el `senderModel` se propaga correctamente a la notificación para una trazabilidad completa.

## 2. Frontend: Estandarización de Tipos e IDs

- [x] 2.1 Refactorizar `MeetView.tsx` para eliminar el uso de `MockUser` y utilizar la interfaz `User` estándar, asegurando el uso de `_id`.
- [x] 2.2 Limpiar `ChatPanel.tsx` eliminando la función auxiliar `getSafeId` y utilizando `_id` de forma consistente en toda la lógica de filtrado.

## 3. Frontend: Sincronización e Idempotencia

- [x] 3.1 Ajustar `handleSendMessage` en `ChatPanel.tsx` para sincronizar el estado local únicamente con el objeto retornado por la API (HTTP 200), garantizando que el mensaje tenga su `_id` final.
- [x] 3.2 Implementar un chequeo de duplicidad en el receptor de mensajes de Socket.io (posiblemente en `SocketContext.tsx` o `ChatPanel.tsx`) que ignore mensajes cuyo `_id` ya esté presente en el estado.

## 4. Verificación y Estabilización

- [x] 4.1 Probar el flujo Alumno -> Profesor y validar que la notificación en la base de datos tiene `recipientModel: 'Professor'`.
- [x] 4.2 Probar el flujo Profesor -> Alumno y validar que la notificación tiene `recipientModel: 'Alumno'`.
- [x] 4.3 Confirmar visualmente que el envío de mensajes es fluido y no produce parpadeos ni duplicados en la lista de mensajes.
