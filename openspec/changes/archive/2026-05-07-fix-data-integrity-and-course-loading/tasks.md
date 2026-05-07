## 1. Backend: Limpieza de Base de Datos

- [x] 1.1 Modificar `main/backend/src/config/seed.js` para eliminar la creación por defecto de sesiones de horario.
- [x] 1.2 Refactorizar `main/backend/src/controllers/userController.js` para no asignar todos los cursos a los profesores en `getUser` si esto causa confusión.

## 2. Frontend: Robustez y Rutas

- [x] 2.1 Refactorizar el filtrado de cursos en `TeacherDashboardView.tsx` para usar `.toString()` y añadir logs de depuración.
- [x] 2.2 Corregir el paso de la prop `user` en el caso `default` de `App.tsx`.
- [x] 2.3 Asegurar que `TeacherDashboardView` use el ID normalizado para todas las peticiones a la API.

## 3. Verificación

- [x] 3.1 Ejecutar el seed y verificar que la colección `Schedule` está vacía.
- [x] 3.2 Iniciar sesión como profesor y verificar en la consola los logs de ID de usuario y profesor.
- [x] 3.3 Confirmar que las asignaturas aparecen correctamente en el selector del horario.
