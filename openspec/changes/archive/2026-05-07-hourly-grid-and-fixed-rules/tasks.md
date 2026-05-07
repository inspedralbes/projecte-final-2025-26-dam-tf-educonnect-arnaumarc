## 1. Backend: Nuevas Validaciones de Tiempo

- [x] 1.1 Actualizar `createScheduleSession` en `scheduleController.js` para validar duraciones de exactamente 1 o 2 horas.
- [x] 1.2 Actualizar el rango de Patio en el controlador (11:00 - 11:30).
- [x] 1.3 Actualizar el rango de Comida en el controlador (15:30 - 17:00).

## 2. Frontend: Rediseño del Grid y Selectores

- [x] 2.1 Modificar la constante `HOURS` en `ScheduleEditor.tsx` para generar intervalos de 1 hora.
- [x] 2.2 Actualizar el `<select>` de duraciones en `ScheduleEditor.tsx` para ofrecer solo 1 hora y 2 horas.
- [x] 2.3 Ajustar las funciones `isPatio` e `isDescanso` en `ScheduleEditor.tsx` con los nuevos horarios.
- [x] 2.4 Ajustar el estilo visual de los bloques bloqueados en el grid para reflejar los descansos.

## 3. Frontend: Ajuste de Visualización de Sesiones

- [x] 3.1 Actualizar `getSessionSpan` en `ScheduleEditor.tsx` para que se base en bloques de 1 hora (ej. 1h = 1 span, 2h = 2 span).
- [x] 3.2 Asegurar que el cálculo de `height` en el estilo de la sesión siga siendo proporcional al nuevo span.

## 4. Verificación y Limpieza

- [x] 4.1 Actualizar `seed.js` para que los horarios de ejemplo cumplan las nuevas restricciones (1h/2h, sin solapes con descansos).
- [x] 4.2 Realizar pruebas manuales de creación de sesiones y validación de errores.
