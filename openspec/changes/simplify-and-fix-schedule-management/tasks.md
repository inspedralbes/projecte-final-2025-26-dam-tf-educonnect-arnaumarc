## 1. Backend: Simplificación a Aula Única

- [x] 1.1 Modificar `scheduleController.js` para que todas las sesiones se guarden con `classroom: 'Aula Única'`.
- [x] 1.2 Simplificar la lógica de solapamiento en el controlador para ignorar el aula solicitada y usar siempre 'Aula Única'.
- [x] 1.3 Actualizar el endpoint `GET /schedule` para que por defecto filtre por 'Aula Única' o devuelva todas las sesiones si solo hay un espacio.

## 2. Frontend: Interfaz de Usuario y Limpieza

- [x] 2.1 Eliminar la constante `CLASSROOMS` con múltiples valores en `ScheduleEditor.tsx` y dejar solo `['Aula Única']`.
- [x] 2.2 Eliminar el estado `selectedClassroom` y su selector `<select>` en el componente `ScheduleEditor`.
- [x] 2.3 Asegurar que las llamadas a la API (`fetchSchedule`, `handleAddSession`) usen 'Aula Única' de forma constante.
- [x] 2.4 Actualizar `WeeklyCalendar.tsx` para eliminar referencias a múltiples aulas si fuera necesario (aunque suele ser de solo lectura).

## 3. Frontend: Corrección Visual del Grid

- [x] 3.1 Revisar y corregir el cálculo de `height` en `ScheduleEditor.tsx` para asegurar que las tarjetas de sesión cubran todas las celdas correspondientes.
- [x] 3.2 Verificar el posicionamiento CSS de las tarjetas para que no se vean recortadas por las filas inferiores del grid.
- [x] 3.3 Validar que una sesión de 1 hora ocupe visualmente 2 celdas y una de 2.5 horas ocupe 5 celdas.

## 4. Datos y Verificación

- [x] 4.1 Actualizar `seed.js` en el backend para que las sesiones de ejemplo usen 'Aula Única'.
- [x] 4.2 Realizar una prueba manual creando sesiones de diferentes duraciones y verificando el solapamiento en el aula única.
