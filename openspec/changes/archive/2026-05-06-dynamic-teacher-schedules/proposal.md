## Why

Actualmente, la gestión de horarios es estática y centralizada. Para empoderar a los docentes y reflejar la realidad de un centro educativo dinámico, es necesario permitir que los profesores asignados gestionen sus propios bloques de clase dentro de restricciones físicas (una sola aula) y temporales (turnos de mañana/tarde y descansos obligatorios).

## What Changes

- **Bolsa de Horas Semanales**: Cada curso tendrá una asignación de entre 4 y 6 horas semanales.
- **Gestión Autónoma del Profesor**: Los profesores podrán añadir sesiones de 1 o 2 horas para sus asignaturas.
- **Restricciones de Aula Única**: No se podrán solapar dos clases en el mismo horario.
- **Bloqueos Horarios**:
    - Patio: 11:00 - 11:30 (Bloqueado)
    - Descanso Comida: 14:00 - 15:00 (Bloqueado)
    - Turnos: Mañana (08:00 - 14:00) y Tarde (15:00 - 21:00).
- **Validación en Tiempo Real**: El sistema impedirá guardar cambios que violen estas reglas.

## Capabilities

### New Capabilities
- `dynamic-schedule-management`: Capacidad para que los profesores creen y editen sesiones de clase respetando una bolsa de horas y conflictos de aula.
- `schedule-constraint-validation`: Motor de reglas para validar rangos horarios, descansos y solapamientos.

### Modified Capabilities
- `professor-centralization`: Se extiende para incluir la responsabilidad de la gestión del horario de sus propias clases.

## Impact

- **Modelos**: `Course` (añadir `totalWeeklyHours`) y `Schedule`.
- **Backend**: Nuevos controladores para la validación y guardado de horarios.
- **Frontend**: Nueva interfaz de gestión de horarios para profesores y actualización de `WeeklyCalendar` para reflejar cambios dinámicos.
- **UX**: Feedback inmediato sobre conflictos de horario o agotamiento de la bolsa de horas.
