## Context

El sistema actual permite crear actividades y tareas, pero no rastrea el cumplimiento por parte de los alumnos de forma automatizada. Los profesores deben revisar manualmente quién ha entregado, lo cual es ineficiente. Este diseño introduce un sistema centralizado de entregas con notificaciones en tiempo real.

## Goals / Non-Goals

**Goals:**
- Automatizar el seguimiento de entregas (Pendiente, A tiempo, Tarde).
- Proporcionar una interfaz de entrega flexible para el alumno (Archivo/Comentario).
- Actualizar la vista del profesor al instante mediante WebSockets.
- Permitir al profesor enviar recordatorios masivos con un clic.

**Non-Goals:**
- Calificación automática de tareas (se mantiene manual o fuera de alcance por ahora).
- Sistema de revisión por pares.
- Integración con almacenamiento en la nube externo (se usará almacenamiento local o URLs directas).

## Decisions

### 1. Modelo de Datos: `Submission`
Se creará una nueva colección `submissions` para desacoplar las entregas de los recursos/eventos originales.
- **Campos**: `studentId`, `activityId`, `courseId`, `submissionType`, `content` (Ruta al archivo o texto), `originalFilename`, `submittedAt`, `status`.
- **Razón**: Proporciona trazabilidad completa.

### 2. Actualizaciones en Tiempo Real
Utilizar la infraestructura de `Socket.io` existente.
- **Flujo**: Al guardar una entrega -> Emitir evento `new_submission` al `professorId` o a la sala del curso.
- **Razón**: Mejora la experiencia de usuario del profesor sin necesidad de recargar la página.

### 3. Configuración de Actividades
Modificar los esquemas de `Topic` (recursos) y `Event` para incluir:
- `requiresSubmission`: Boolean.
- `submissionType`: Enum ('file', 'comment', 'done').
- **Razón**: Da control total al profesor sobre cómo espera que se complete cada tarea.

### 4. Lógica de Seguimiento (Tracker)
El frontend calculará el estado comparando la lista de alumnos del curso con las entregas existentes.
- **Pendientes**: Alumnos en `enrolledCourses` sin entrega en la actividad.
- **Tarde**: Alumnos con entrega donde `submittedAt > activity.dueDate`.

### 5. Gestión de Archivos con Multer
Se integrará la librería `multer` para procesar la subida de archivos físicos al servidor.
- **Almacenamiento**: Local en `backend/uploads/submissions/`.
- **Naming**: Los archivos se renombrarán con un timestamp y el ID del alumno para evitar colisiones.

### 6. Seguridad de Identidad (Identity Guard)
El backend validará la identidad del alumno usando el token JWT.
- **Lógica**: Se comparará el `studentId` del cuerpo de la petición con el `userId` extraído del token autenticado. Si no coinciden, la petición se denegará (403 Forbidden).
- **Razón**: Evitar que alumnos malintencionados realicen entregas en nombre de otros.

### 7. Lógica de Re-entrega y Confirmación
El sistema permitirá sobrescribir entregas previas pero requerirá una confirmación explícita del usuario.
- **Frontend**: Detectará si ya existe una entrega y mostrará un modal de confirmación informando sobre la anulación de la entrega anterior.
- **Backend**: Realizará un `findOneAndUpdate` que actualizará la fecha y el contenido, pero mantendrá el historial en el servidor si fuera necesario (opcional).

## Risks / Trade-offs

- **Riesgo**: Agotamiento de espacio en disco por archivos duplicados.
  - **Mitigación**: Implementar una limpieza automática de archivos antiguos cuando una entrega es sobrescrita.
- **Riesgo**: Suplantación de identidad si se compromete el token.
  - **Mitigación**: Usar tokens de corta duración y validación estricta de roles.
- **Riesgo**: Sobrecarga de sockets si hay muchos alumnos entregando a la vez.
  - **Mitigación**: Los eventos de entrega son pequeños (IDs y metadatos), lo que minimiza el impacto.
- **Riesgo**: Desincronización de estado si falla el socket.
  - **Mitigación**: Implementar un botón de refresco manual y cargar el estado inicial vía REST al abrir el panel.
