## Context

Actualmente, el backend y el frontend manejan un campo `classroom` que permite teóricamente múltiples espacios. Sin embargo, para 2DAM solo se utiliza un aula. El sistema de validación de conflictos debe simplificarse para considerar el horario como un recurso compartido único.

## Goals / Non-Goals

**Goals:**
- Centralizar toda la lógica de validación horaria en un único recurso (tiempo) asumiendo sala única.
- Eliminar la posibilidad de que el usuario elija o edite el nombre del aula.
- Limpiar el `seed.js` para asegurar un horario de grupo único coherente.

**Non-Goals:**
- **No añadir temas demo**: No se crearán contenidos de ejemplo (temas, recursos o actividades) para las nuevas asignaturas en esta fase.
- No implementar gestión de múltiples grupos o desdobles.

## Decisions

### 1. Hardcoding de "Aula Única" en el Backend
Se modificará el controlador de horarios para que cualquier petición de creación ignore el campo `classroom` del body y asigne automáticamente "Aula Única".
- **Razón**: Evita inconsistencias en la base de datos si se enviaran valores diferentes desde herramientas externas o versiones antiguas del frontend.

### 2. Simplificación de la UI del Calendario
Se eliminará el campo de texto "Aula" en el `ScheduleEditor.tsx`.
- **Razón**: Mejora la experiencia de usuario al eliminar campos redundantes que siempre tienen el mismo valor.

### 3. Validación de Solapamientos Global
La lógica de validación en `scheduleController.js` se simplificará. Si hay una sesión en un rango horario, no puede haber otra, independientemente del aula (ya que solo hay una).

## Risks / Trade-offs

- **Riesgo**: Si en el futuro se necesitan dos aulas, habrá que revertir el hardcoding.
- **Mitigación**: El campo sigue existiendo en el esquema de la base de datos, solo se controla su valor en la capa de lógica.
