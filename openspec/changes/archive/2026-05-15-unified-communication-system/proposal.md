## Why

Actualmente existe una desconexión entre los avisos automáticos (notificaciones) y los avisos manuales (mensajes), lo que provoca que los alumnos pierdan visibilidad de actualizaciones importantes tras refrescar el Tablón. Además, la falta de una herramienta de chat en el Meet obliga a usar canales externos, fragmentando la comunicación y generando fatiga por acumulación de notificaciones no agrupadas.

## What Changes

- **Unificación de Fuente**: El Tablón consumirá tanto la colección de `Messages` como la de `Notifications` de forma integrada.
- **Agrupación Inteligente**: Las notificaciones de materiales y temas se agruparán por asignatura para evitar el colapso visual.
- **Chat Integrado en Meet**: Nueva interfaz de mensajería dentro de la vista de Meet sincronizada con el sistema global.
- **Ciclo de Vida de Avisos**: Implementación de lógica de archivado/caducidad para avisos temporales (materiales, temas) después de 7 días.
- **Estandarización de Metadatos**: Asegurar que todas las notificaciones incluyan `courseId` para su correcta clasificación.
- **Centralización de Sockets**: Migración de toda la lógica de tiempo real al `SocketContext` global, eliminando conexiones redundantes en las vistas.

## Capabilities

### New Capabilities
- `communication-centralization`: Capacidad de gestionar y visualizar todos los flujos de comunicación (mensajes, avisos, alertas de sistema) desde un punto único con lógica de prioridad.
- `meet-chat-service`: Servicio de mensajería en tiempo real integrado en la experiencia de videollamada.

### Modified Capabilities
- `unified-resource-management`: Se modifica la forma en que los nuevos recursos notifican al alumno para permitir la agrupación.
- `course-details-enhancement`: Mejora de la interacción entre el detalle del curso y el envío de avisos masivos.

## Impact

- **Backend**: Modificaciones en `messageController`, `notificationController` y `notificationHelper`.
- **Frontend**: Refactorización profunda de `TablonView.tsx` y `MeetView.tsx`.
- **Contexto**: Actualización de `SocketContext.tsx` para soportar nuevos eventos de chat.
- **API**: Nuevos filtros en los endpoints de mensajes y notificaciones.
