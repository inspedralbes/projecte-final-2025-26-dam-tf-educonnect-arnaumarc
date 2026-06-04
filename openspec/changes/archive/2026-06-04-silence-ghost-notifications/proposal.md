## Why

Actualmente, las notificaciones no leídas se envían por duplicado al cargar la página: una vez a través de la API REST y otra vez a través del evento de sincronización de Sockets (`sync_notifications`). Esto provoca que notificaciones antiguas aparezcan como nuevas "de la nada" al recargar, afectando negativamente a la experiencia de usuario (UX).

## What Changes

- **Backend**: Se eliminará la lógica de búsqueda de notificaciones pendientes y el envío del evento `sync_notifications` dentro de la suscripción `register_user` en el backend.
- **Frontend**: Se eliminará (o silenciará) el listener de `sync_notifications` en el `SocketContext` para evitar inyecciones duplicadas en el feed.
- **Flujo**: El sistema confiará exclusivamente en la API REST para cargar el historial de notificaciones al inicio, dejando al Socket la única responsabilidad de notificar eventos en tiempo real.

## Capabilities

### Modified Capabilities
- `notification-persistence`: Se ajustarán los requisitos de entrega para evitar la redundancia en la sincronización inicial.

## Impact

- **Backend**: `main/backend/src/index.js` (eliminación de código).
- **Frontend**: `main/frontend/src/context/SocketContext.tsx` (eliminación de listener).
