## 1. Corrección del Bug de Integración

- [x] 1.1 Modificar `App.tsx` para pasar la prop `user` al componente `TeacherDashboardView`.
- [x] 1.2 Actualizar `TeacherDashboardView.tsx` para recibir la prop `user` y verificar que el filtrado de asignaturas funciona.

## 2. Mejoras en el Backend (API y Validación)

- [x] 2.1 Actualizar el controlador `scheduleController.js` para filtrar por aula si se recibe el parámetro de consulta `classroom`.
- [x] 2.2 Refactorizar la validación de solapamientos en `createScheduleSession` para que sea específica por aula y no global.
- [x] 2.3 Ajustar la validación de duración en el backend para permitir sesiones con granularidad de 30 minutos.

## 3. Evolución del ScheduleEditor (Frontend)

- [x] 3.1 Añadir un selector de aulas predefinidas en el componente `ScheduleEditor.tsx`.
- [x] 3.2 Refactorizar el grid del horario para visualizar bloques de 30 minutos.
- [x] 3.3 Implementar la capa de visualización de conflictos (sesiones de otros cursos en el aula seleccionada).
- [x] 3.4 Actualizar la interfaz de creación de sesiones para permitir seleccionar duraciones variables (30min - 2.5h).

## 4. Verificación y Testing

- [x] 4.1 Verificar que el selector de asignaturas carga correctamente las materias del profesor logueado.
- [x] 4.2 Validar que la reserva de aulas diferentes a la misma hora funciona sin conflictos.
- [x] 4.3 Confirmar que el sistema bloquea solapamientos reales en la misma aula con un mensaje descriptivo.
