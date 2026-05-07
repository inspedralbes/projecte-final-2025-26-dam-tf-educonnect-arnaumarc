## Why

El sistema actual de horarios permite la gestión de múltiples aulas, lo cual añade complejidad innecesaria dado que el centro opera principalmente en un espacio único. Además, existe un error visual en el componente `ScheduleEditor` donde las sesiones de 1 hora (o superiores a 30 min) solo ocupan una casilla del grid, lo que confunde a los usuarios sobre la duración real de la clase.

## What Changes

- Simplificación de la lógica de aulas a una única ubicación predeterminada ("Aula Única").
- Eliminación del selector de aulas en la interfaz de usuario.
- Corrección del cálculo de altura/span en el componente `ScheduleEditor` para que las sesiones ocupen el número correcto de filas (1 fila por cada 30 minutos).
- Ajuste de las validaciones del backend para manejar la restricción de aula única de forma consistente.

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `dynamic-schedule-management`: Se elimina el requisito de multi-aula y se ajusta la visualización para reflejar con precisión la duración de las sesiones.

## Impact

- **Frontend**: Modificaciones en `ScheduleEditor.tsx` y `WeeklyCalendar.tsx`.
- **Backend**: Ajustes en `scheduleController.js` para simplificar la lógica de solapamiento centrada en una única aula.
- **Base de Datos**: Los registros existentes de horarios deberán ser consistentes con la nueva "Aula Única".
