## Why

El sistema de chat 1-a-1 implementado recientemente presenta fallos de fiabilidad y consistencia que impiden su uso profesional: las notificaciones son erróneas para profesores, existen condiciones de carrera que duplican mensajes en la UI y la gestión de identidades de usuario es inconsistente entre componentes. Es necesario estabilizarlo para garantizar una comunicación privada segura y funcional durante las reuniones.

## What Changes

- **Backend**: Corrección del `recipientModel` en las notificaciones para soportar dinámicamente tanto a alumnos como a profesores.
- **Frontend**: Estandarización del modelo de usuario para usar `_id` de forma consistente, eliminando la necesidad de adaptadores como `getSafeId`.
- **Sincronización**: Refactorización del flujo de envío de mensajes para evitar duplicados en la UI causados por la recepción simultánea vía HTTP y Socket.io.
- **Interfaz**: Mejoras de robustez en `ChatPanel` y `MeetView` para asegurar que el chat sea estrictamente privado entre los participantes seleccionados.

## Capabilities

### New Capabilities
- `private-message-reliability`: Garantiza la entrega íntegra y sin duplicados de mensajes privados, con notificaciones correctas según el rol del usuario.

### Modified Capabilities
- `meet-chat-service`: Se ajustan los requisitos de entrega para asegurar persistencia y notificaciones polimórficas.

## Impact

- `main/backend/src/controllers/messageController.js`: Lógica de creación de notificaciones.
- `main/frontend/components/ChatPanel.tsx`: Manejo de estado de mensajes y envío.
- `main/frontend/views/MeetView.tsx`: Gestión de usuarios y selección de chat.
- `main/frontend/src/context/SocketContext.tsx`: Sincronización de eventos de socket.
