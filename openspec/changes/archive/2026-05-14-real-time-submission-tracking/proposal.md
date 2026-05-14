## Why

Los profesores necesitan una forma en tiempo real de rastrear las entregas de los alumnos para cada actividad, identificando rápidamente quién tiene tareas pendientes y quién ha entregado tarde, para mejorar la gestión académica y la capacidad de respuesta.

## What Changes

- **Nuevo modelo de Entregas (Submissions)** en el backend para almacenar el trabajo de los alumnos (archivos o comentarios).
- **Actualizaciones en tiempo real** mediante WebSockets cuando un alumno realiza una entrega.
- **Panel de Seguimiento** en el frontend para el profesor dentro de cada actividad, mostrando listas de "Pendientes", "Fuera de Plazo" y "Completados".
- **Tipos de entrega configurables** por el profesor (archivo, comentario o simplemente marcar como completado).
- **Sistema de recordatorios rápidos** mediante notificaciones para alumnos con tareas pendientes.

## Capabilities

### New Capabilities
- `submission-tracking`: Monitoreo en tiempo real del estado de las entregas y cálculos de puntualidad.
- `submission-management`: Gestión de la subida de archivos y comentarios de los alumnos para las actividades.

### Modified Capabilities
- `unified-resource-management`: Añadir configuraciones de entrega a las tareas y recursos.
- `course-details-enhancement`: Integrar la vista de seguimiento y el sistema de recordatorios en la interfaz de detalles del curso.

## Impact

- **Backend**: Nuevos modelos de datos (Submission), controladores para gestionar entregas y lógica de sockets para notificar al profesor.
- **Frontend**: Nuevos componentes de interfaz para la entrega del alumno y el panel de seguimiento del profesor.
- **Base de Datos**: Nueva colección `submissions`.
- **APIs**: Nuevos endpoints `/api/submissions`.
