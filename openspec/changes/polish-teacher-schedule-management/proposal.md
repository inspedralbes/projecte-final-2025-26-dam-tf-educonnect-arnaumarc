## Why

A pesar de las mejoras funcionales recientes, el sistema de gestión de horarios presenta fricciones de usabilidad críticas: fallos en la sincronización inicial del selector de asignaturas que impiden añadir clases, inconsistencias en los formatos de hora que bloquean el borrado de sesiones propias y una falta de feedback visual ante errores. Además, es imperativo revisar la robustez de las conexiones a la base de datos para asegurar la estabilidad del sistema bajo carga.

## What Changes

- **Sincronización de Estado (Frontend)**: Implementar una selección automática del primer curso disponible al cargar el componente para evitar estados vacíos inválidos.
- **Normalización de Formatos**: Estandarizar el formato de horas (`08:00` vs `8:00`) tanto en el backend (seed/API) como en el frontend para asegurar que las comparaciones de propiedad (ownership) funcionen correctamente.
- **Feedback de Errores y Acciones**: Añadir notificaciones visuales (`react-hot-toast`) al añadir, borrar o fallar en operaciones del horario.
- **Revisión de Conexiones DB**: Auditoría y refactorización del módulo de conexión a MongoDB para asegurar el uso correcto de pools de conexiones y manejo de eventos de reconexión.
- **Actualización de Etiquetas**: Corregir las referencias obsoletas a "Aula Única" en el portal docente.

## Capabilities

### New Capabilities
- `database-connection-resilience`: Asegurar que el backend maneje correctamente las conexiones a la base de datos sin fugas ni bloqueos.
- `ui-state-synchronization`: Garantizar que los selectores y el grid estén siempre sincronizados con los datos del servidor.

### Modified Capabilities
- `dynamic-schedule-management`: Se añadirá el requerimiento de feedback visual ante cualquier cambio en el horario.

## Impact

- **Frontend**: `main/frontend/components/ScheduleEditor.tsx`, `main/frontend/views/TeacherDashboardView.tsx`.
- **Backend**: `main/backend/src/config/db.js`, `main/backend/src/controllers/scheduleController.js`, `main/backend/src/config/seed.js`.
- **UX**: Mejora significativa en la fluidez y respuesta del sistema de horarios.
