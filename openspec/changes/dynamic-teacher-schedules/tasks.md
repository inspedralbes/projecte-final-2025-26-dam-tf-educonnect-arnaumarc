## 1. Actualización de Modelos y Backend

- [x] 1.1 Añadir el campo `totalWeeklyHours` al modelo `Course.js`.
- [x] 1.2 Implementar lógica de validación de conflictos en el controlador de `Schedule`.
- [x] 1.3 Crear endpoint para obtener las horas restantes de una asignatura.
- [x] 1.4 Actualizar el script de `seed.js` para asignar horas semanales predeterminadas a los cursos.

## 2. Interfaz del Profesor (Frontend)

- [x] 2.1 Crear el componente `ScheduleEditor` con visualización de bloques de patio y comida.
- [x] 2.2 Implementar selector de asignaturas y visualización de "Bolsa de Horas".
- [x] 2.3 Añadir lógica de interacción para colocar sesiones de 1h o 2h haciendo clic.
- [x] 2.4 Integrar alertas de conflicto y de límite de horas alcanzado.

## 3. Integración y Verificación

- [x] 3.1 Conectar el frontend con el nuevo endpoint de guardado de horarios.
- [x] 3.2 Verificar que el sistema bloquea correctamente solapamientos en la única aula.
- [x] 3.3 Comprobar que los alumnos ven los cambios del horario en tiempo real.
