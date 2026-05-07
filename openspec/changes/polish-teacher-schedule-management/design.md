## Context

El sistema de horarios ha pasado de un modelo estático a uno dinámico y multi-aula. Sin embargo, persisten problemas de "última milla" en la experiencia de usuario y en la robustez técnica. Los profesores experimentan fallos al añadir clases debido a estados iniciales vacíos y fallos al borrar debido a inconsistencias de formato de hora (`8:00` vs `08:00`). Además, la conexión a la base de datos requiere una revisión para asegurar que sea resiliente.

## Goals / Non-Goals

**Goals:**
- Asegurar que el `selectedCourseId` siempre tenga un valor válido al cargar.
- Estandarizar el formato de tiempo en `HH:mm`.
- Implementar notificaciones tipo toast para todas las acciones del horario.
- Refactorizar el módulo de conexión a la base de datos para manejar errores y reconexiones.

**Non-Goals:**
- No se añadirá autenticación adicional ni cambios en los permisos de usuario.
- No se modificará el esquema de las colecciones existentes en MongoDB.

## Decisions

### 1. Inicialización de Estado con `useEffect`
- **Decisión**: Añadir un `useEffect` en `ScheduleEditor.tsx` que observe cambios en la prop `courses` y asigne `courses[0].id` a `selectedCourseId` si este último está vacío.
- **Razón**: Evita que el usuario intente añadir una clase con un ID nulo si no ha cambiado manualmente el selector.

### 2. Normalización de Tiempos
- **Decisión**: Crear una utilidad `formatTime(str)` que asegure que cualquier string de hora tenga el formato `HH:mm` (añadiendo el cero inicial si es necesario). Aplicar esto antes de enviar datos al servidor y al comparar sesiones para el renderizado.
- **Razón**: Garantiza la integridad de las comparaciones lógicas en el frontend y la consistencia en la base de datos.

### 3. Notificaciones Toast
- **Decisión**: Utilizar `react-hot-toast` (ya integrado en el proyecto) para informar al usuario sobre el resultado de sus acciones en el horario.
- **Razón**: Mejora la percepción de respuesta del sistema y ayuda a diagnosticar fallos de validación rápidamente.

### 4. Robustez de Conexión a Base de Datos
- **Decisión**: Actualizar `main/backend/src/config/db.js` para configurar opciones de `maxPoolSize`, `serverSelectionTimeoutMS` y escuchar eventos de `error`, `disconnected` y `reconnected` de Mongoose.
- **Razón**: Proporciona visibilidad sobre el estado de la conexión y asegura que el servidor no quede en un estado zombi si MongoDB falla temporalmente.

## Risks / Trade-offs

- **[Riesgo]** → La normalización de tiempos podría afectar a datos ya existentes si no se sincroniza con un re-seed.
  - **Mitigación** → Se actualizará el archivo `seed.js` para usar el nuevo formato normalizado y se recomienda limpiar la base de datos antes de aplicar.
- **[Riesgo]** → Sobrecarga de notificaciones toast.
  - **Mitigación** → Agrupar notificaciones y usar tiempos de expiración cortos para acciones frecuentes.
