## 1. Backend: Gestión de Presencia

- [x] 1.1 Implementar mapa `userStates` en `index.js`.
- [x] 1.2 Actualizar eventos `register_user` y `disconnect` para actualizar estados.
- [x] 1.3 Emitir evento `user_state_changed` a todos los clientes.
- [x] 1.4 Modificar lógica de `call_user` para verificar si el destinatario está `BUSY`.

## 2. Frontend: Visualización y Lógica

- [x] 2.1 Actualizar `SocketContext.tsx` para escuchar `user_state_changed` y actualizar la lista de usuarios.
- [x] 2.2 Modificar `MeetView.tsx` para mostrar indicadores visuales de estado (verde: Online, rojo: Ocupado, gris: Offline).
- [x] 2.3 Asegurar que el botón de llamada se deshabilite si el usuario está `BUSY` o `OFFLINE`.

## 3. Interacción P2P Alumno-Alumno

- [x] 3.1 Revisar filtros en `MeetView.tsx` para que los alumnos vean a otros alumnos en la lista.
- [x] 3.2 Probar flujo de señalización entre dos cuentas de alumno.
