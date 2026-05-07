## 1. Robustez de la Base de Datos

- [x] 1.1 Refactorizar `main/backend/src/config/db.js` para incluir manejo de eventos de conexión y opciones de pooling.
- [x] 1.2 Actualizar `main/backend/src/config/seed.js` para normalizar los formatos de hora a `HH:mm`.

## 2. Refinamiento de la UX del Horario (Frontend)

- [x] 2.1 Implementar auto-selección de curso inicial en `ScheduleEditor.tsx` mediante un `useEffect`.
- [x] 2.2 Crear utilidad de normalización de horas y aplicarla en las comparaciones de propiedad de sesiones.
- [x] 2.3 Integrar notificaciones `toast` de éxito/error en las funciones `handleAddSession` y `handleDeleteSession`.
- [x] 2.4 Actualizar el título de la vista y etiquetas obsoletas ("Aula Única").

## 3. Validación y Pulido Final

- [x] 3.1 Verificar que al entrar al dashboard, la primera asignatura está seleccionada y permite añadir una clase sin cambiar el selector.
- [x] 3.2 Confirmar que todas las sesiones propias muestran el botón de borrar (normalización de horas exitosa).
- [x] 3.3 Simular un error del backend y verificar que aparece una notificación toast de error.
- [x] 3.4 Verificar la estabilidad de la conexión a la base de datos tras las refactorizaciones.
