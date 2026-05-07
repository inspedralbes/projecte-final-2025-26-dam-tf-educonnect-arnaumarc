## Why

El sistema actual permite teóricamente la gestión de múltiples aulas o divisiones de grupo, lo cual introduce una complejidad innecesaria para el alcance actual del proyecto de 2DAM. Se busca simplificar la gestión del horario y la visualización de datos consolidando todo en una única sala ("Aula Única") para evitar confusiones y errores de solapamiento manual.

## What Changes

- Consolidación de todas las sesiones de horario existentes y futuras en la sala "Aula Única".
- Eliminación de cualquier lógica o referencia a divisiones de grupo en los controladores de horario.
- Actualización de las semillas de datos para reflejar este estándar de sala única.
- **BREAKING**: Las APIs de creación de horarios ahora ignorarán o forzarán el campo classroom a "Aula Única".

## Capabilities

### New Capabilities
- `single-classroom-policy`: Política que asegura que todas las sesiones de clase ocurran en un entorno centralizado sin divisiones físicas o lógicas de grupo.

### Modified Capabilities
- `dynamic-schedule-management`: Se restringe la posibilidad de asignar múltiples aulas, simplificando la validación de conflictos.

## Impact

- `main/backend/src/config/seed.js`: Actualización definitiva de las sesiones.
- `main/backend/src/controllers/scheduleController.js`: Simplificación de la validación de solapamientos (ahora solo importa el tiempo, no el aula).
- `main/frontend/components/ScheduleEditor.tsx`: Interfaz simplificada donde el aula es un valor fijo o predeterminado.
