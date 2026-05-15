## 1. Backend: Estandarización de Metadatos

- [x] 1.1 Modificar `notificationHelper.js` para asegurar que el `courseId` siempre se incluya en el objeto `meta` de la notificación.
- [x] 1.2 Actualizar `courseController.js` para que la función `notifyAllStudents` pueble correctamente el campo `courseId` en las notificaciones masivas.
- [x] 1.3 Asegurar que las notificaciones de creación de eventos y temas incluyan el `type` y `courseId` requeridos para la agrupación.

## 2. Contexto: Centralización de Sockets

- [x] 2.1 Refactorizar `SocketContext.tsx` para incluir un estado `feed` que combine mensajes y notificaciones iniciales.
- [x] 2.2 Implementar en `SocketContext` los listeners globales para `new_notification` y `new_message` que actualicen el estado `feed`.
- [x] 2.3 Eliminar las instancias locales de `io()` y listeners redundantes en `TablonView.tsx` y `MeetView.tsx`.

## 3. Tablón: Unificación y Agrupación Inteligente

- [x] 3.1 Definir la interfaz `FeedItem` y el mapper para normalizar objetos `Message` y `Notification`.
- [x] 3.2 Implementar la lógica de agrupación (Smart Grouping) por asignatura, tipo y ventana temporal (48h).
- [x] 3.3 Implementar el filtro de archivado automático para notificaciones de sistema con más de 7 días de antigüedad.
- [x] 3.4 Rediseñar la UI de `TablonView` para renderizar el feed unificado con soporte para grupos colapsables.

## 4. Meet: Chat en Tiempo Real

- [x] 4.1 Crear el componente `ChatPanel.tsx` con soporte para mensajes de sesión y persistencia en DB.
- [x] 4.2 Integrar el `ChatPanel` en `MeetView.tsx` como un panel lateral colapsable.
- [x] 4.3 Implementar eventos de sistema en el chat (unirse/salir) y sincronización con el historial del Tablón.
