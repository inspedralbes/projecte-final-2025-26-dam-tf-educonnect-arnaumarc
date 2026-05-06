## 1. Refactorización del Backend

- [x] 1.1 Modificar el modelo `Course.js` para que el campo `professor` sea un `ObjectId` referenciando a `Professor`.
- [x] 1.2 Actualizar el script `seed.js` para que primero limpie las colecciones (`Course`, `Schedule`, `Professor`).
- [x] 1.3 Ajustar `seed.js` para crear a Xavier como profesor único y vincularlo a las 4 asignaturas mediante su `_id`.
- [x] 1.4 Modificar el controlador `courseController.js` para añadir `.populate('professor')` en las consultas de cursos si es necesario.

## 2. Limpieza del Frontend

- [x] 2.1 Vaciar `MOCK_COURSES` y `MOCK_SCHEDULE` en `main/frontend/constants.ts`.
- [x] 2.2 Actualizar `AsignaturasView.tsx` para eliminar la lógica de fallback que usa los mocks.
- [x] 2.3 Asegurar que el componente `WeeklyCalendar` maneje correctamente los `courseId` de MongoDB (strings largos en lugar de '1', '2'...).

## 3. Verificación y Pruebas

- [x] 3.1 Ejecutar el comando de seed y verificar que la base de datos tenga la estructura correcta.
- [x] 3.2 Comprobar en el frontend que el horario semanal se pinta correctamente usando solo datos de la API.
- [x] 3.3 Verificar que al entrar en el detalle de una asignatura, la información del profesor sea consistente.
