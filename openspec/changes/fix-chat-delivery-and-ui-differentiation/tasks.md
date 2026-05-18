## 1. Reestructuración de Sockets (Backend)

- [ ] 1.1 Modificar `main/backend/src/index.js` para que los usuarios se unan a una sala (room) con su `userId` al registrarse.
- [ ] 1.2 Actualizar `main/backend/src/controllers/messageController.js` para emitir eventos `new_message` a la sala del receptor (`io.to(receiverId)`).
- [ ] 1.3 Asegurar que el remitente también reciba el evento en su propia sala para sincronizar múltiples pestañas.

## 2. Refuerzo del Modelo de Datos (Backend)

- [ ] 2.1 Actualizar `main/backend/src/models/Message.js` para usar `refPath` en el campo `receiver`, permitiendo referencias a 'Alumno' o 'Professor'.
- [ ] 2.2 Asegurar que el campo `receiverModel` se guarde correctamente al crear un mensaje.

## 3. Lógica de UI e Identidad (Frontend)

- [ ] 3.1 Implementar la función `getSafeId` en `main/frontend/components/ChatPanel.tsx` para normalizar comparaciones de identidad.
- [ ] 3.2 Corregir el mapeo de mensajes en el renderizado para usar `isMe` basado en la normalización de IDs.
- [ ] 3.3 Aplicar estilos condicionales (alineación y color) para diferenciar visualmente los mensajes propios de los ajenos.

## 4. Validación Final

- [ ] 4.1 Probar el envío de mensajes con dos pestañas del mismo usuario abiertas.
- [ ] 4.2 Verificar que los mensajes recibidos aparecen instantáneamente sin recargar.
- [ ] 4.3 Confirmar que la disposición visual (burbujas izquierda/derecha) es correcta según el remitente.
