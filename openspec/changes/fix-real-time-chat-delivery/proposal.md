## Why

Actualmente, los mensajes enviados en el chat de Meet no aparecen instantáneamente para el emisor y el receptor no recibe la notificación de mensaje en tiempo real, requiriendo una recarga de la página para ver las actualizaciones. Esto rompe la fluidez de la comunicación síncrona necesaria para las clases.

## What Changes

- **Actualización inmediata del emisor**: Modificación del flujo de envío en el frontend para procesar correctamente la respuesta de la API e insertarla en el estado local.
- **Notificaciones de Socket para mensajes**: El backend emitirá un evento dedicado `new_message` además de la notificación genérica.
- **Integridad de datos en tiempo real**: Los mensajes emitidos y devueltos por la API incluirán la información del emisor (populated) para evitar errores de renderizado.

## Capabilities

### New Capabilities
- `real-time-message-sync`: Define los requisitos de sincronización instantánea de mensajes entre clientes y servidor sin recargas manuales.

### Modified Capabilities
- `meet-chat-service`: Se actualiza para incluir la obligatoriedad de entrega en tiempo real de los mensajes de texto a través de sockets.

## Impact

- **Backend Controllers**: `messageController.js` (emisión de sockets y población de datos).
- **Frontend Context**: `SocketContext.tsx` (manejo de la lista global de mensajes).
- **Frontend Components**: `ChatPanel.tsx` (flujo de envío y actualización de estado).
