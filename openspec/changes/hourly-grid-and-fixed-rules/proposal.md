## Why

El sistema de gestión de horarios actual utiliza intervalos de 30 minutos y permite una variedad de duraciones que complican la planificación. El usuario desea simplificar el grid a intervalos de 1 hora y restringir las sesiones de clase a 1 o 2 horas para facilitar la organización y evitar errores.

## What Changes

- Redefinición del grid de horarios en `ScheduleEditor.tsx` para usar bloques de 1 hora (ej. 8:00 - 9:00).
- Restricción de la duración de las clases a exactamente 1 o 2 horas (**BREAKING** para la flexibilidad actual).
- Ajuste del horario de patio a 11:00 - 11:30.
- Ajuste del horario de comida a 15:30 - 17:00.
- Actualización de las validaciones en el backend para reflejar estas nuevas restricciones de tiempo y descansos.

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `dynamic-schedule-management`: Se modifican las reglas de duración de sesiones, la granularidad del grid y los rangos de descanso (patio y comida).

## Impact

- **Frontend**: Cambios en la generación de `HOURS`, validación de duraciones y lógica de bloqueo visual en `ScheduleEditor.tsx`.
- **Backend**: Cambios en `createScheduleSession` en `scheduleController.js` para validar duraciones de 1/2 horas y los nuevos rangos de descanso.
- **Base de Datos**: Las sesiones existentes que no cumplan con las nuevas reglas de duración o que colisionen con los nuevos descansos podrían quedar invalidadas.
