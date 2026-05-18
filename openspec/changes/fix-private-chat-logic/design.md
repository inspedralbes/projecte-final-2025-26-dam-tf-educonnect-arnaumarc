## Context

El chat de Meet actual se basa en un modelo de mensajería privada 1-a-1. Aunque la base técnica está presente (Socket.io + MongoDB), la implementación tiene fugas de lógica:
- Las notificaciones asumen que el receptor siempre es un `Alumno`.
- El frontend gestiona los mensajes de forma redundante (HTTP + Socket), lo que causa parpadeos o duplicados.
- Existe una disparidad de tipos (`User` vs `MockUser` vs `MessageData`) que obliga al uso de adaptadores defensivos.

## Goals / Non-Goals

**Goals:**
- Asegurar que las notificaciones lleguen correctamente tanto a Alumnos como a Profesores.
- Garantizar una UI libre de mensajes duplicados o "fantasmas".
- Simplificar el flujo de datos en el frontend eliminando redundancias de mapeo de IDs.

**Non-Goals:**
- Implementar chats de grupo o salas de Meet (se mantiene el modelo privado 1-a-1 por ahora).
- Refactorizar todo el sistema de notificaciones global (solo el flujo de mensajes).

## Decisions

### 1. Notificaciones Polimórficas Dinámicas
**Decisión:** Usar el campo `receiverModel` enviado desde el frontend para crear la notificación en el backend.
**Racional:** El backend no debe adivinar el tipo de usuario. Dado que el frontend sabe a quién está escribiendo, pasar este metadato asegura que la referencia en `Notification` sea correcta.
**Alternativa:** Buscar el usuario en la DB antes de crear la notificación para determinar su tipo. Descartado por latencia extra innecesaria.

### 2. Sincronización de UI Basada en ID
**Decisión:** El `SocketContext` filtrará los mensajes entrantes por `_id`. El `ChatPanel` añadirá el mensaje al estado solo tras recibir la confirmación HTTP (200 OK) con el objeto de mensaje completo.
**Racional:** Evita duplicar el mensaje cuando el socket emite al propio `sender`. Al usar el `_id` generado por MongoDB como clave única, garantizamos idempotencia.
**Alternativa:** Solo usar Sockets para todo. Descartado porque perderíamos la garantía de persistencia inmediata y manejo de errores del flujo HTTP.

### 3. Estandarización de Interfaces (`User` Everywhere)
**Decisión:** Reemplazar `MockUser` en `MeetView.tsx` por la interfaz `User` real o una extensión compatible que use `_id`.
**Racional:** Eliminar `getSafeId` y mapeos intermedios reduce la superficie de bugs y hace el código más legible.

## Risks / Trade-offs

- **[Riesgo]** Desfase si la notificación falla pero el mensaje se guarda. → **Mitigación**: Envolver la creación de mensaje y notificación en un bloque try/catch; si uno falla críticamente, informar al usuario, aunque se prioriza la persistencia del mensaje.
- **[Trade-off]** Mayor carga de metadatos en el payload (enviar `senderModel` y `receiverModel`). → **Justificación**: Es necesario para el sistema polimórfico de Mongoose.
