## 1. Backend: Persistencia de Eventos de Meet

- [x] 1.1 Modificar el controlador de mensajes/sockets para crear una `Notification` de tipo `MEET_MESSAGE` al enviar mensajes privados.
- [x] 1.2 Implementar creación automática de notificación `MEET_CALL` cuando se emite el evento `call_user`.

## 2. Backend: Lógica de Agrupamiento Inteligente

- [x] 2.1 Refactorizar `getUserNotifications` en `notificationController.js` para agrupar ítems no leídos por `type` y `meta.courseId`.
- [x] 2.2 Asegurar que el objeto retornado incluya un campo `count` para el frontend.

## 3. Frontend: Sincronización y UI de Toasts

- [x] 3.1 Actualizar `SocketContext.tsx` para manejar ítems agregados en el feed.
- [x] 3.2 Crear componente `InteractiveToast` en la carpeta `components`.
- [x] 3.3 Integrar `InteractiveToast` en `NotificationBot.tsx` con acción de "Marcar como leído".

## 4. Frontend: Historial de Actividad

- [x] 4.1 Crear `ActivityHistoryView.tsx` en la carpeta `views`.
- [x] 4.2 Implementar filtros por categoría (Académico, Social, Sistema) en la vista de historial.
- [x] 4.3 Vincular la Navbar o el footer del NotificationPanel a esta nueva vista.
