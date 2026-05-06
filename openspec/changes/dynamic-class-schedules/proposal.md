## Why

Actualmente, el calendario semanal no muestra los horarios de clase cuando se utiliza un usuario real debido a una inconsistencia entre los IDs de prueba y los de la base de datos. Además, la información de horarios dentro del detalle de las asignaturas es estática (hardcoded), lo que impide que los alumnos vean la información real de sus clases.

## What Changes

- **Sincronización de Horarios**: Modificar el filtro del calendario semanal para que sea compatible con los ObjectIDs de MongoDB.
- **Horarios Dinámicos en Detalles**: Sustituir el texto estático de horarios en la vista de detalles del curso por una carga dinámica desde el backend.
- **API de Horarios por Curso**: Crear un nuevo endpoint en el backend para obtener el horario específico de un curso.

## Capabilities

### New Capabilities
- `dynamic-schedules`: Capacidad para consultar y mostrar horarios de clase reales y actualizados tanto en el calendario general como en el detalle de cada asignatura.

### Modified Capabilities
<!-- Ninguna especificación existente será modificada ya que el directorio de specs está vacío actualmente. -->

## Impact

- **Frontend**: `AsignaturasView.tsx` (lógica de filtrado), `CourseDetailsView.tsx` (nueva carga de datos y renderizado dinámico).
- **Backend**: `courseController.js` (nuevo método `getCourseSchedule`), `courseRoutes.js` (nueva ruta), `scheduleController.js`.
- **Types**: `types.ts` (asegurar consistencia de tipos).
