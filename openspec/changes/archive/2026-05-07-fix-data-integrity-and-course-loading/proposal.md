## Why

El sistema de gestión de horarios sigue presentando problemas de carga de asignaturas para el profesor, probablemente debido a una vinculación de IDs frágil en el frontend. Además, el horario contiene datos de prueba predefinidos que interfieren con la experiencia del usuario y requieren una limpieza total para permitir una gestión desde cero.

## What Changes

- **Limpieza de Datos (BACKEND)**: Modificar el script de `seed.js` para que no cree sesiones de horario por defecto, asegurando un inicio limpio.
- **Robustez del Filtrado (FRONTEND)**: Refactorizar la lógica de filtrado de cursos en `TeacherDashboardView.tsx` para asegurar que el ID del profesor se compare correctamente, independientemente de si es un objeto o un string.
- **Corrección de Rutas (FRONTEND)**: Asegurar que el componente `App.tsx` siempre pase el objeto `user` a las vistas correspondientes en todos los casos de renderizado.
- **Trazabilidad**: Añadir logs informativos en el frontend para diagnosticar en tiempo real el estado del objeto `user` y los cursos recibidos.

## Capabilities

### New Capabilities
- `clean-slate-initialization`: Capacidad de iniciar el sistema con colecciones de datos críticas (profesores, alumnos, cursos) pero sin transacciones volátiles (horarios, mensajes) para permitir pruebas puras.

### Modified Capabilities
- `dynamic-schedule-management`: Se modificará el requerimiento de carga de cursos para asegurar una vinculación de propiedad (ownership) más resiliente.

## Impact

- **Backend**: `main/backend/src/config/seed.js`.
- **Frontend**: `main/frontend/App.tsx`, `main/frontend/views/TeacherDashboardView.tsx`.
- **Base de Datos**: Eliminación de documentos de la colección `Schedule` durante el proceso de desarrollo/seed.
