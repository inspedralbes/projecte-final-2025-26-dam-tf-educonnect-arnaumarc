## Context

El sistema de gestión de horarios actual maneja múltiples aulas, pero el centro requiere una simplificación a un espacio único. Además, existe un desfase visual en el `ScheduleEditor` donde cada celda del grid representa 30 minutos, pero las sesiones no se expanden correctamente para cubrir su duración total (ej. una clase de 1 hora solo ocupa visualmente 30 minutos).

## Goals / Non-Goals

**Goals:**
- Unificar todas las sesiones de horario en un único espacio denominado "Aula Única".
- Eliminar la complejidad de selección de aula en el frontend.
- Asegurar que el componente `ScheduleEditor` represente fielmente la duración de las clases (1h = 2 celdas).
- Mantener la integridad de las validaciones de solapamiento en el backend.

**Non-Goals:**
- No se migrarán los datos históricos de aulas diferentes a la nueva "Aula Única" automáticamente (se asume un re-seed o limpieza manual si es necesario, aunque se intentará que el backend sea resiliente).
- No se cambiará la estructura de la base de datos (colección `Schedule`).

## Decisions

### 1. Eliminación del selector de aulas
- **Decisión**: Eliminar el estado `selectedClassroom` y el componente `<select>` correspondiente en `ScheduleEditor.tsx`.
- **Razón**: Reducción de la carga cognitiva para el profesor y alineación con los requisitos del centro. Todas las peticiones al backend enviarán `classroom: 'Aula Única'`.

### 2. Corrección del Renderizado del Grid
- **Decisión**: Revisar y ajustar el cálculo de `height` en la tarjeta de sesión dentro de `ScheduleEditor.tsx`. Se usará la fórmula `height: calc(span * (row_height + border))`.
- **Razón**: Actualmente el cálculo de `getSessionSpan` parece correcto (`Math.ceil(durationMinutes / 30)`), pero el CSS o el contenedor del grid podrían estar limitando la visualización. Se asegurará que el contenedor de la sesión tenga `z-index` y `position: absolute` correcto respecto a su celda de origen.

### 3. Simplificación de Validaciones en Backend
- **Decisión**: En `scheduleController.js`, forzar que cualquier nueva sesión se asigne al "Aula Única" si el campo viene vacío o con otros valores.
- **Razón**: Garantiza que, incluso si se realizan peticiones manuales a la API, se respete la restricción de aula única para evitar solapamientos invisibles.

## Risks / Trade-offs

- **[Riesgo]** → Sesiones antiguas con nombres de aulas distintos podrían dejar de aparecer en el filtro por defecto si el frontend pide específicamente "Aula Única".
  - **Mitigación** → El backend devolverá por defecto todas las sesiones si no se especifica aula, o se actualizará el `seed.js` para que todos los datos iniciales usen el nuevo nombre.
- **[Riesgo]** → Problemas de desbordamiento (overflow) en el grid si las sesiones son muy largas.
  - **Mitigación** → El grid ya tiene `overflow-y-auto`, se validará que el scroll funcione correctamente con las tarjetas expandidas.
