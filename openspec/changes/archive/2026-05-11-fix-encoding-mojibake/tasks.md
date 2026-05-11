## 1. Corrección en el Frontend

- [x] 1.1 Corregir cadenas mojibake en `main/frontend/views/CourseDetailsView.tsx`.
- [x] 1.2 Corregir cadenas mojibake en `main/frontend/components/NotificationPanel.tsx`.
- [x] 1.3 Revisar y corregir otros archivos del frontend detectados (ej. `ProfileView.tsx` si aplica).

## 2. Corrección en el Backend

- [x] 2.1 Corregir mensajes de error y notificaciones en `main/backend/src/controllers/courseController.js`.
- [x] 2.2 Corregir mensajes en `main/backend/src/controllers/notificationController.js`.
- [x] 2.3 Revisar y limpiar `main/backend/sql/init.sql` y `main/backend/src/config/seed.js` para asegurar datos limpios.

## 3. Verificación y Limpieza

- [x] 3.1 Ejecutar búsqueda global de patrones `Ã³`, `Ã¡`, etc., para asegurar que no queden restos.
- [x] 3.2 Verificar visualmente en el navegador que las secciones de Asignaturas y Detalles de Curso se vean correctamente.
- [x] 3.3 Confirmar que las notificaciones recibidas por socket/API muestran los caracteres correctos.
