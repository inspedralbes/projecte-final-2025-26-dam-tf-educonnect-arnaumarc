## 1. Backend: Estadísticas Reales

- [x] 1.1 Modificar `userController.js` para incluir conteo de entregas (`Submissions`) en el endpoint de perfil.
- [x] 1.2 Modificar `userController.js` para incluir conteo de mensajes (`Messages`) en el endpoint de perfil.
- [x] 1.3 Verificar que el endpoint `/api/user/:id` devuelve correctamente el objeto `stats`.

## 2. Frontend: Interfaz de Perfil

- [x] 2.1 Actualizar `ProfileView.tsx` para eliminar los valores mock (8.5 y 4).
- [x] 2.2 Vincular los nuevos campos de `user.stats` a la visualización de "Cursos", "Entregas" y "Actividad".
- [x] 2.3 Ajustar etiquetas en la cuadrícula de estadísticas para que sean coherentes (Cursos, Entregas, Actividad).

## 3. Validación

- [x] 3.1 Comprobar con un usuario real que el número de entregas coincide con la base de datos.
- [x] 3.2 Verificar que el cambio de tema (Dark/Light) no afecta a las nuevas estadísticas dinámicas.
