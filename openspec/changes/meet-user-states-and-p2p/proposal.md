## Why

Actualmente, las llamadas en EduConnect son unidireccionales (típicamente de profesor a alumno) y carecen de un sistema de gestión de presencia (estados). Los usuarios no saben si un contacto está disponible, ocupado en otra llamada o desconectado, lo que genera intentos de llamada fallidos o interrupciones. Además, queremos habilitar la comunicación P2P entre alumnos para fomentar la colaboración.

## What Changes

- **Presencia**: Implementación de estados de usuario: "En línea", "Desconectado" y "Ocupado" (durante una llamada).
- **Interacción**: Habilitación de llamadas Meet entre alumnos (P2P).
- **Seguridad/UX**: Bloqueo de llamadas entrantes si el usuario ya está en una llamada (estado "Ocupado").
- **UI**: Visualización de los estados en la lista de contactos de Meet.

## Capabilities

### New Capabilities
- `user-presence`: Capacidad del sistema para rastrear y difundir el estado de conexión y disponibilidad de los usuarios en tiempo real.

### Modified Capabilities
- `meet-chat-service`: Se añadirán requisitos para permitir la comunicación entre cualquier par de usuarios (Alumno-Alumno) y manejar el estado de ocupado.

## Impact

- **Backend**: `index.js` (sockets) para gestionar los estados y difundirlos.
- **Frontend**: `SocketContext.tsx` y `MeetView.tsx` para mostrar y reaccionar a los estados.
- **Modelos**: Podría requerir un campo temporal de estado en el modelo de usuario o manejarse puramente en memoria de socket.
