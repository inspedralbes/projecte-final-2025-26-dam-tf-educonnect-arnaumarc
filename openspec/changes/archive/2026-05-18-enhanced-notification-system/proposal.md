## Why

El sistema de notificaciones actual es fragmentado y carece de persistencia para eventos críticos de Meet (llamadas perdidas, chats), lo que provoca pérdida de información si el usuario no está en línea o refresca la página. Además, la acumulación de avisos individuales genera ruido visual y reduce la eficacia de la comunicación.

## What Changes

- **Persistencia Extendida**: Implementación de almacenamiento en base de datos para eventos de Meet (llamadas entrantes y mensajes) para asegurar que sean visibles retroactivamente.
- **Agrupamiento Inteligente**: Lógica en el backend/frontend para consolidar múltiples notificaciones del mismo tipo y origen en una sola entrada (ej: "3 nuevos materiales").
- **Historial de Actividad**: Creación de una vista dedicada para consultar todas las notificaciones pasadas con filtros por categoría.
- **Interacción Mejorada**: Actualización de los Toasts para permitir acciones rápidas (marcar como leído) sin abrir el panel lateral.

## Capabilities

### New Capabilities
- `notification-persistence`: Asegura que el 100% de los eventos críticos se registren en MongoDB antes de emitirse por Sockets.
- `smart-notification-grouping`: Algoritmo de agrupación por `type`, `courseId` y ventana de tiempo.
- `activity-history`: Nueva vista de sistema para la gestión masiva de alertas.

### Modified Capabilities
- `meet-chat-service`: Ahora requiere persistencia obligatoria de metadatos de llamada.

## Impact

- `main/backend/src/controllers/notificationController.js`: Lógica de creación y agrupamiento.
- `main/backend/src/models/Notification.js`: Nuevos campos para metadatos de agrupamiento.
- `main/frontend/src/context/SocketContext.tsx`: Sincronización del estado agrupado.
- `main/frontend/components/NotificationPanel.tsx`: UI para la vista de historial.
