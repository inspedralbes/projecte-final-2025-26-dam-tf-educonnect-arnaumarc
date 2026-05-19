## Why

Permite que alumnos y profesores se comuniquen por texto de forma asíncrona o síncrona dentro del módulo Meet sin la obligatoriedad de iniciar una videollamada, eliminando la barrera de entrada de la cámara/micrófono para consultas rápidas.

## What Changes

- **Desacoplamiento de estados**: Separación del concepto de "Usuario seleccionado para Chat" del "Usuario en Llamada".
- **Interfaz de Selección**: Adición de un botón de mensaje directo en la lista de usuarios de Meet.
- **Flujo de Chat persistente**: El panel de chat podrá abrirse y funcionar seleccionando a cualquier usuario de la lista, independientemente de si hay un flujo WebRTC activo.
- **Placeholder de Video Dinámico**: Mejora del área central para mostrar información del usuario seleccionado para chat cuando no hay video.

## Capabilities

### New Capabilities
- `standalone-messaging`: Define el comportamiento de la mensajería instantánea dentro del contexto de Meet sin requerir medios (audio/video).

### Modified Capabilities
- `meet-chat-service`: Actualización de los requisitos para permitir la apertura del panel de chat basándose únicamente en la selección del usuario, no en el estado de la llamada.

## Impact

- **Frontend Views**: `MeetView.tsx` (gestión de estados y botones de acción).
- **Frontend Components**: `ChatPanel.tsx` (manejo de destinatario).
- **Context**: `SocketContext.tsx` (posible necesidad de trackear el `activeChatUser` globalmente si se desea persistencia entre vistas).
