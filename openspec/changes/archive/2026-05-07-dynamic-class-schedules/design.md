## Context

El sistema cuenta con una base de datos MongoDB y un frontend en React. El modelo `Schedule` ya existe, pero su uso es limitado. El frontend usa datos mockeados en algunos puntos y en otros hace peticiones a `/api/schedule` que devuelve todos los horarios del sistema, sin filtrar eficientemente por curso en el servidor.

## Goals / Non-Goals

**Goals:**
- Implementar una carga de horarios reactiva y dinámica en el detalle del curso.
- Centralizar la lógica de filtrado de horarios en el servidor para el detalle del curso.
- Asegurar que el calendario semanal funcione correctamente con IDs reales de MongoDB.

**Non-Goals:**
- No se implementará un editor de horarios para profesores en esta fase.
- No se modificará el esquema de la base de datos `Schedule`.

## Decisions

### 1. Nuevo endpoint `GET /api/courses/:courseId/schedule`
- **Decisión**: Crear un endpoint específico para obtener el horario de un curso por su ID.
- **Razón**: Mejora el rendimiento al no descargar todos los horarios del sistema en el cliente cuando solo se necesita uno.
- **Alternativa**: Filtrar en el frontend. Descartado por ser ineficiente a medida que crezca la base de datos.

### 2. Normalización de IDs en `AsignaturasView.tsx`
- **Decisión**: Asegurar que tanto los cursos como las sesiones de horario utilicen el mismo formato de ID (`_id` de MongoDB) antes de realizar el filtrado.
- **Razón**: Actualmente hay una mezcla de IDs de mock (strings cortos) y ObjectIDs (24 carac.), lo que causa fallos silenciosos en el filtrado.

### 3. Componente Dinámico de Horarios en `CourseDetailsView`
- **Decisión**: Crear una sub-sección dentro de la pestaña "Información" que realice su propia petición al nuevo endpoint del backend.
- **Razón**: Mantiene la vista de detalles desacoplada y siempre actualizada.

## Risks / Trade-offs

- **[Riesgo]** Fallo en la visualización si el backend no tiene horarios para un curso real.
  - **Mitigación**: Mostrar un mensaje informativo "No hay horarios programados para esta asignatura" en lugar de un espacio en blanco o error.
- **[Riesgo]** Inconsistencia con datos mock.
  - **Mitigación**: Priorizar siempre los datos de la API y solo usar mocks como último recurso si la API falla o devuelve vacío pero el usuario es el usuario de prueba predefinido.
