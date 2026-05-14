## 1. Frontend - Interfaz de Configuración (Profesor)

- [x] 1.1 Modificar el modal de "Añadir Recurso" en `CourseDetailsView.tsx` para incluir el selector de tipo de entrega (archivo, comentario, completar).
- [x] 1.2 Actualizar el modal de "Añadir Evento" para incluir las opciones de entrega si la modalidad es digital.
- [x] 1.3 Adaptar el componente de visualización de recursos para mostrar el estado de la tarea al alumno (Pendiente/Entregado).

## 2. Frontend - Panel de Seguimiento en Tiempo Real (Profesor)

- [x] 2.1 Crear el componente `SubmissionTracker` que muestre las listas de Pendientes, Fuera de Plazo y Completados.
- [x] 2.2 Integrar el acceso al panel de Seguimiento desde cada tarea en `CourseDetailsView`.
- [x] 2.3 Implementar el botón "Recordar a todos" que invoque la API de notificaciones masivas.
- [x] 2.4 Implementar la lógica de visualización del contenido de la entrega (ver comentario o enlace al archivo).

## 3. Backend - Modelos y Base de Datos

- [x] 3.1 Crear el modelo `Submission.js` en `main/backend/src/models/`.
- [x] 3.2 Actualizar los modelos `Topic.js` (resourceSchema) y `Event.js` para incluir campos `requiresSubmission` y `submissionType`.
- [x] 3.3 Registrar el nuevo modelo en los controladores correspondientes.

## 4. Backend - APIs y Lógica de Negocio

- [x] 4.1 Implementar las rutas y controladores para `POST /api/submissions` gestionando los diferentes tipos de contenido.
- [x] 4.2 Implementar `GET /api/courses/:id/submissions` para obtener el estado global de entregas del curso.
- [x] 4.3 Implementar el endpoint de notificaciones masivas para alumnos pendientes.

## 5. Tiempo Real e Integración

- [x] 5.1 Emitir el evento de socket `submission_updated` desde el backend al recibir una entrega.
- [x] 5.2 Configurar el Listener en el frontend para mover a los alumnos entre listas en tiempo real.
- [x] 5.3 Realizar pruebas de integración extremo a extremo: entrega de alumno -> actualización en profesor -> envío de recordatorio.

## 6. Refuerzo de Seguridad y Archivos (COMPLETADO)

- [x] 6.1 Instalar y configurar `multer` en el backend para la subida de archivos físicos.
- [x] 6.2 Implementar middleware de validación de identidad (JWT vs studentId).
- [x] 6.3 Actualizar el controlador de entregas para manejar archivos reales y rutas de almacenamiento.
- [x] 6.4 Implementar modal de confirmación en el frontend para re-entregas.
- [x] 6.5 Añadir lógica de limpieza de archivos antiguos al sobrescribir una entrega.
