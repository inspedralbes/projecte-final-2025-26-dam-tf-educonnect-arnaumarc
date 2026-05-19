## 1. Backend - Modelo y Controladores

- [x] 1.1 Añadir el campo `sourceId` (ObjectId) al esquema de `Notification.js`.
- [x] 1.2 Implementar la función `deleteNotification` en `notificationController.js` que maneje el borrado por ID único o lista de IDs (agrupadas).
- [x] 1.3 Implementar la función `deleteAllReadNotifications` en `notificationController.js` para limpieza masiva.
- [x] 1.4 Registrar los nuevos endpoints (`DELETE /:notificationId`, `DELETE /user/:userId/read`) en `notificationRoutes.js`.

## 2. Backend - Ciclo de Vida y Automatización

- [x] 2.1 Implementar una tarea programada (`setInterval`) en `backend/src/index.js` que elimine notificaciones de Meet con >24h de antigüedad.
- [x] 2.2 Actualizar `topicController.js` para que al eliminar un tema o recurso, se eliminen las notificaciones vinculadas mediante `sourceId`.
- [x] 2.3 Actualizar `notificationHelper.js` y otros controladores para que incluyan el `sourceId` al crear notificaciones académicas.

## 3. Frontend - Estado y UI

- [x] 3.1 Añadir la función `deleteNotification` a `SocketContext.tsx` que realice la llamada a la API y actualice el estado local.
- [x] 3.2 Integrar botones de borrado (🗑️) en los elementos de lista de `NotificationPanel.tsx`.
- [x] 3.3 Añadir botones de borrado individual y el botón global "Limpiar historial de leídos" en `ActivityHistoryView.tsx`.
- [x] 3.4 Asegurar que el `unreadCount` se actualice correctamente al eliminar notificaciones no leídas.

## 4. Verificación y Pruebas

- [x] 4.1 Verificar que el borrado individual funciona y se refleja instantáneamente en la UI.
- [x] 4.2 Comprobar que el borrado masivo de leídos funciona correctamente.
- [x] 4.3 Validar que el proceso de limpieza de Meet funciona (puedes probar con un intervalo corto de minutos).
- [x] 4.4 Confirmar que al borrar una tarea como profesor, las notificaciones de los alumnos desaparecen.
