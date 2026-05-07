## Why

La gestión de horarios de profesores presenta actualmente un bug crítico en el paso de propiedades que impide la selección de asignaturas, además de limitaciones funcionales significativas: un modelo rígido de "Aula Única", falta de flexibilidad en la duración de las sesiones y nula visibilidad de los conflictos de aula antes de intentar guardar. Es necesario corregir estos fallos para que el sistema sea usable y escalable para múltiples aulas y docentes.

## What Changes

- **Corrección de Bug (FRONTEND)**: Asegurar el paso correcto del objeto `user` desde `App.tsx` a `TeacherDashboardView` para permitir el filtrado de asignaturas.
- **Gestión Multi-Aula (BACKEND/FRONTEND)**: Eliminar el hardcoding de "Aula Única" y permitir la selección de diferentes espacios (Aula 1, Aula 2, Lab, etc.).
- **Flexibilidad de Duración**: Permitir sesiones de duración variable (incluyendo fracciones de 0.5h para cubrir huecos tras el patio) en lugar de sesiones fijas de 1h.
- **Visualización de Conflictos**: Mostrar en el grid del horario qué huecos están ya ocupados por otros profesores/cursos en el aula seleccionada.
- **Validaciones Mejoradas**: Refinar la lógica de validación en el backend para manejar múltiples aulas y proporcionar errores más descriptivos.

## Capabilities

### New Capabilities
- `multi-classroom-management`: Implementación de la lógica de selección y validación para múltiples espacios físicos.
- `conflict-visibility-layer`: Capa de interfaz que muestra la ocupación del aula en tiempo real para evitar intentos de guardado fallidos.

### Modified Capabilities
- `dynamic-schedule-management`: Se eliminará la restricción de "Single Classroom" y se flexibilizará la "Session Duration Constraint" para soportar incrementos de 30 minutos.

## Impact

- **Frontend**: `main/frontend/App.tsx`, `main/frontend/components/ScheduleEditor.tsx`, `main/frontend/views/TeacherDashboardView.tsx`.
- **Backend**: `main/backend/src/controllers/scheduleController.js`, `main/backend/src/models/Schedule.js`.
- **API**: Actualización del endpoint `POST /api/schedule` para aceptar y validar múltiples aulas.
