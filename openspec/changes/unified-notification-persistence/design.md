## Context

El flujo actual de notificaciones de Meet es redundante. El backend ya persiste la notificación, pero el frontend crea una local que no está sincronizada con la base de datos.

## Goals / Non-Goals

**Goals:**
- Unificar el flujo de notificaciones bajo una "única fuente de verdad" (la DB del backend).
- Eliminar la inconsistencia de notificaciones que desaparecen al refrescar.
- Asegurar que las llamadas entrantes se notifiquen visualmente de forma persistente.

**Non-Goals:**
- Cambiar la lógica de expiración de 24 horas.
- Rediseñar el panel de notificaciones.

## Decisions

- **Single Source of Truth**: El frontend dejará de inyectar objetos manuales en el array `notifications`. Solo responderá a los eventos `new_notification` y `sync_notifications`.
- **Atomicidad en Backend**: Al recibir `call_user`, el backend primero guardará la notificación y luego emitirá `new_notification` e `incoming_call` de forma que el cliente reciba ambos casi simultáneamente.

## Risks / Trade-offs

- **[Riesgo] Delay**: Si la base de datos es lenta, la notificación podría tardar unos milisegundos más en aparecer que si fuera local.
- **[Mitigación]**: El beneficio de la persistencia y la coherencia supera este pequeño delay (imperceptible para el usuario).
