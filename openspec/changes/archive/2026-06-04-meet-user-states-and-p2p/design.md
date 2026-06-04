## Context

EduConnect utiliza Socket.io para la señalización de WebRTC. Actualmente, el servidor no rastrea si un usuario está ocupado en una llamada, lo que causa conflictos de señalización si llega una segunda llamada.

## Goals / Non-Goals

**Goals:**
- Implementar un sistema de presencia en tiempo real (Online, Offline, Ocupado).
- Permitir llamadas entre alumnos.
- Prevenir colisiones de llamadas (Busy signal).

**Non-Goals:**
- Videollamadas grupales (se mantiene 1 a 1).
- Grabación de llamadas.

## Decisions

- **Gestión de Estados**: El backend mantendrá un mapa `userStates` (UserId -> State) en memoria.
- **Difusión**: Cada vez que un estado cambia (login, logout, start_call, end_call), se emitirá un evento `user_state_changed` a todos los usuarios conectados.
- **Lógica de Ocupado**: Si `call_user` se dirige a alguien con estado `BUSY`, el servidor responderá automáticamente con `call_failed` (razón: "User is busy").

## Risks / Trade-offs

- **[Riesgo] Desincronización**: Si un socket se desconecta bruscamente durante una llamada, el estado podría quedar como "Ocupado".
- **[Mitigación]**: El evento `disconnect` del socket debe limpiar forzosamente el estado y liberar cualquier llamada activa.
