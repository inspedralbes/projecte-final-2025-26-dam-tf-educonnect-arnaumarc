## 1. Backend - Consolidación de Aula Única

- [x] 1.1 Actualizar `main/backend/src/config/seed.js` para asegurar que todas las sesiones de horario predeterminadas tengan el valor `"Aula Única"`.
- [x] 1.2 Modificar `createScheduleSession` en `main/backend/src/controllers/scheduleController.js` para forzar `classroom: "Aula Única"` e ignorar el valor enviado por el cliente.
- [x] 1.3 Simplificar la lógica de detección de solapamientos en el backend para que no dependa del campo classroom.

## 2. Frontend - Simplificación de Interfaz

- [x] 2.1 Eliminar el campo de entrada (input) para el aula en `main/frontend/components/ScheduleEditor.tsx`.
- [x] 2.2 Asegurar que el objeto enviado al backend desde el frontend no incluya el campo classroom o envíe siempre el valor estático.

## 3. Validación y Limpieza

- [x] 3.1 Reiniciar la base de datos (Docker restart) y verificar que el horario inicial se carga correctamente en "Aula Única".
- [x] 3.2 Verificar que no se pueden crear dos clases en el mismo horario.
- [x] 3.3 Confirmar que no se han añadido temas demo en las nuevas asignaturas.
