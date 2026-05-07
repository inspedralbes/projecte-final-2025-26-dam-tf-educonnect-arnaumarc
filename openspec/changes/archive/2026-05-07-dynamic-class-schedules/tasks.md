## 1. Backend: API de Horarios

- [x] 1.1 Crear el método `getCourseSchedule` en `main/backend/src/controllers/courseController.js` para filtrar horarios por `courseId`.
- [x] 1.2 Añadir la ruta `GET /courses/:courseId/schedule` en `main/backend/src/routes/courseRoutes.js`.
- [x] 1.3 Verificar que el endpoint devuelve datos correctos para un ID de curso real y mock.

## 2. Frontend: Calendario Semanal

- [x] 2.1 Modificar `main/frontend/views/AsignaturasView.tsx` para normalizar los IDs al filtrar `enrolledSchedule`.
- [x] 2.2 Asegurar que el componente `WeeklyCalendar` reciba los horarios filtrados correctamente usando strings para comparar IDs.

## 3. Frontend: Detalles del Curso

- [x] 3.1 Añadir estado `courseSchedule` y función `fetchCourseSchedule` en `main/frontend/views/CourseDetailsView.tsx`.
- [x] 3.2 Actualizar el renderizado de la sección "Horarios" en la pestaña "info" para mapear los datos dinámicos.
- [x] 3.3 Añadir un estado de carga y manejo de caso vacío ("No hay horarios") para la sección de horarios.

## 4. Verificación y Pruebas

- [x] 4.1 Probar la visualización del calendario con un usuario real y verificar que aparecen sus clases.
- [x] 4.2 Probar que al entrar en el detalle de una asignatura se cargan sus horarios específicos.
- [x] 4.3 Verificar la persistencia de datos y que no hay errores de consola por IDs no coincidentes.
