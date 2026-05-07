## 1. Backend: Mejora de la Población de Datos

- [x] 1.1 Modificar `main/backend/src/controllers/authController.js` para poblar `enrolledCourses` y `professor` en el login de alumnos.
- [x] 1.2 Modificar `main/backend/src/controllers/userController.js` para poblar `enrolledCourses.professor` en la función `getUser`.

## 2. Frontend: Mejoras en la Visualización de Asignaturas

- [x] 2.1 Actualizar `main/frontend/views/CourseDetailsView.tsx` para permitir que los estudiantes carguen la lista de alumnos de la asignatura.
- [x] 2.2 Reemplazar la sección de "Evaluación" por el nuevo bloque de "Miembros de la clase" en `main/frontend/views/CourseDetailsView.tsx`.
- [x] 2.3 Ajustar la visualización del nombre del profesor en `main/frontend/views/CourseDetailsView.tsx` para usar el objeto poblado.
- [x] 2.4 Asegurar la consistencia del nombre del profesor en `main/frontend/views/AsignaturasView.tsx` y `CourseCard.tsx`.
- [x] 2.5 Añadir la ficha de "Información del Docente" (especialidad y contacto) en `main/frontend/views/CourseDetailsView.tsx`.
- [x] 2.6 Mostrar la "Carga Académica" (horas semanales) en `main/frontend/views/CourseDetailsView.tsx`.

## 3. Verificación y Pruebas

- [x] 3.1 Verificar que el login de alumno ahora devuelve los datos del profesor de sus cursos.
- [x] 3.2 Confirmar que un alumno puede ver la lista de sus compañeros en el detalle de la asignatura.
- [x] 3.3 Validar que el nombre del profesor se muestra correctamente (no el ID) en todas las secciones.
