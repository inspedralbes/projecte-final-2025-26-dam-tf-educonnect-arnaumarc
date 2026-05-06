## Why

Actualmente existe una inconsistencia crítica entre los datos simulados (MOCKS) del frontend y la base de datos real. El sistema depende de información estática que no coincide con los IDs de MongoDB, lo que rompe la integridad del horario y la gestión académica. Además, la relación entre asignaturas y profesores es débil (basada en strings), dificultando la atribución real de responsabilidades.

## What Changes

- **Limpieza de MOCKS**: Eliminación de los datos estáticos en el frontend (`constants.ts`) para forzar al sistema a consumir datos reales de la API.
- **Unificación de Profesores**: Centralización de la gestión académica en un único profesor real (Xavier) para simplificar la estructura inicial y "aplanar el camino".
- **Refactorización de Modelos**: Cambio en el modelo de `Course` para referenciar a `Professor` mediante su `_id` en lugar de un nombre estático.
- **Actualización de Seed**: Ajuste de los datos de inicialización para que coincidan con la nueva estructura unificada.

## Capabilities

### New Capabilities
- `professor-centralization`: Capacidad para vincular cada asignatura a un objeto `Professor` real, permitiendo una gestión de permisos y autoría basada en el modelo de datos.
- `api-driven-frontend`: Transición del frontend hacia un estado donde la visualización depende exclusivamente de las respuestas del backend, eliminando el estado simulado.

### Modified Capabilities
- `course-management`: Se modifica el requisito de creación de cursos para exigir una referencia válida a un profesor existente.

## Impact

- **Backend**: Modelos `Course` y `Schedule`, script de `seed.js`, y controladores de asignaturas.
- **Frontend**: Archivo `constants.ts`, componentes `WeeklyCalendar` y `AsignaturasView` (para manejar IDs reales y carga desde API).
- **Base de Datos**: Requiere una limpieza y reinicialización para asegurar que los `courseId` en `Schedules` apunten a los nuevos documentos de MongoDB.
