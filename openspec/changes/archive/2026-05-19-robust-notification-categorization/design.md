## Context

El sistema actual utiliza una categorización de notificaciones basada en la presencia o ausencia de `courseId`. Esto es insuficiente para distinguir entre avisos directos de profesores, eventos de Meet y avisos institucionales globales de la escuela. La vista `TablonView` requiere una lógica más granular para cumplir con las expectativas de los usuarios.

## Goals / Non-Goals

**Goals:**
- Implementar nuevos tipos de notificación: `MEET_CALL`, `MEET_MESSAGE`, `PROFESSOR_ADVISORY`.
- Refactorizar los filtros de `TablonView` para usar tipos y modelos de remitente (`senderModel`).
- Mejorar la consistencia visual de las notificaciones según su origen.
- Asegurar que los mensajes de chat de Meet persistan en el tablón.

**Non-Goals:**
- Rediseñar el sistema de Websockets (se usará la infraestructura existente de `SocketContext`).
- Implementar un sistema de notificaciones push para móviles (fuera de alcance para este cambio).

## Decisions

### 1. Extensión del Modelo de Datos de Notificaciones
Se ampliará el enum de `type` en `Notification.js` para incluir los nuevos tipos. Se añadirá un campo `priority` opcional.
- **Razón**: Permite una clasificación semántica desde el origen.
- **Alternativa**: Usar metadatos genéricos (`meta.category`), pero los tipos explícitos son más fáciles de manejar en el Frontend y para logs.

### 2. Filtrado Centralizado en TablonView
La lógica de filtrado se moverá de "presencia de curso" a "match por tipo/modelo".
- **Personal**: `['MESSAGE', 'MEET_CALL', 'MEET_MESSAGE', 'PROFESSOR_ADVISORY', 'COURSE_INVITE']`.
- **Clase**: Notificaciones con `courseId` que no sean de los tipos anteriores.
- **General**: Notificaciones con `senderModel: 'System'` o `senderModel: 'Admin'`.

### 3. Mapeo Visual por Tipos
Se actualizarán los componentes `NotificationPanel` y `TablonView` para incluir un mapeo de iconos y colores más rico.
- `MEET_CALL` / `MEET_MESSAGE` -> Icono `Phone` / `MessageCircle`.
- `PROFESSOR_ADVISORY` -> Icono `GraduationCap` (Birrete).
- `SYSTEM` -> Icono `Building`.

## Risks / Trade-offs

- **[Riesgo]** Confusión entre Mensajes de Chat (Modelo Message) y Avisos del Profesor (Modelo Notification). → **Mitigación**: Usar iconos claramente distintos y etiquetas de tipo ("Mensaje" vs "Aviso Directo").
- **[Riesgo]** Sobrecarga de notificaciones en la pestaña Personal. → **Mitigación**: Mantener la lógica de auto-archivo (ocultar tras 7 días) activa para todas las pestañas.
