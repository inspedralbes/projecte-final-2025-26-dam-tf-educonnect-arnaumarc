## Why

Actualmente, el chat de Meet presenta fallos críticos de usabilidad y fiabilidad: los mensajes no se distinguen visualmente entre remitente y destinatario, y el destinatario no recibe las actualizaciones en tiempo real, lo que obliga a recargar la página. Esto se debe a una arquitectura de sockets basada en IDs únicos que no soporta múltiples instancias y a una lógica de renderizado que no compara correctamente las identidades.

## What Changes

- **Arquitectura de Sockets Robusta**: Implementación de "Rooms" (salas) por ID de usuario en Socket.io para asegurar que todas las pestañas/dispositivos de un usuario reciban los mensajes.
- **Diferenciación Visual en UI**: Corrección de la lógica de renderizado en `ChatPanel.tsx` para alinear a la derecha (azul) los mensajes propios y a la izquierda (gris) los recibidos, utilizando comparaciones de ID seguras.
- **Normalización de Modelos de Mensaje**: Actualización del modelo `Message` para que las referencias a `sender` y `receiver` sean dinámicas y soporten tanto a Alumnos como a Profesores.
- **Sincronización Total en Tiempo Real**: El backend emitirá a la sala del destinatario y a la sala del remitente para mantener la coherencia sin depender exclusivamente de respuestas REST.

## Capabilities

### New Capabilities
- `multi-instance-socket-sync`: Garantiza que la comunicación en tiempo real sea entregada a todas las conexiones activas de un usuario.
- `chat-identity-differentiation`: Define cómo el sistema debe identificar y representar visualmente el origen de un mensaje en la interfaz.

### Modified Capabilities
- `meet-chat-service`: Se amplía para incluir la obligatoriedad de diferenciación visual y persistencia de identidad.

## Impact

- **Backend Architecture**: `index.js` (unión a salas) y `messageController.js` (emisión a salas).
- **Backend Models**: `Message.js` (referencias dinámicas).
- **Frontend Components**: `ChatPanel.tsx` (lógica de estilos `isMe` y procesamiento de IDs).
