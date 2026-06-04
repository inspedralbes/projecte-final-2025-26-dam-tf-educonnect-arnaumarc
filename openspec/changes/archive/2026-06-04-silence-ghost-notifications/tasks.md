## 1. Backend: Limpieza de Sincronización

- [x] 1.1 Eliminar el bloque de búsqueda de notificaciones pendientes en `index.js` dentro del evento `register_user`.
- [x] 1.2 Eliminar la línea `socket.emit('sync_notifications', pendingNotifications)` en `index.js`.

## 2. Frontend: Limpieza de Listeners

- [x] 2.1 Localizar y eliminar el listener `socket.on('sync_notifications', ...)` en `SocketContext.tsx`.
- [x] 2.2 Asegurar que la función `fetchNotifications` siga siendo la única encargada de cargar el historial al inicio.

## 3. Validación

- [x] 3.1 Recargar la página con notificaciones no leídas y verificar que aparecen en el Tablón una sola vez (vía API).
- [x] 3.2 Verificar que el Socket sigue entregando notificaciones nuevas en tiempo real sin duplicarlas.
