## 1. Mejoras en el Backend (API y Sockets)

- [x] 1.1 Modificar `messageController.js` para popular el campo `sender` con nombre y avatar antes de devolver la respuesta.
- [x] 1.2 Implementar la emisión del evento `new_message` en `messageController.js` dirigida específicamente al socket del receptor.
- [x] 1.3 Asegurar que el objeto de mensaje emitido por socket contenga la misma estructura poblada que la respuesta de la API.

## 2. Mejoras en el Frontend (UI y Estado)

- [x] 2.1 Actualizar `ChatPanel.tsx` para extraer correctamente `data.message` de la respuesta del servidor tras enviar un mensaje.
- [x] 2.2 Modificar el manejo de `setMessages` en `ChatPanel.tsx` para insertar el objeto de mensaje real en lugar de la respuesta completa de la API.
- [x] 2.3 Verificar que el `SocketContext` sigue escuchando `new_message` y actualizando la lista global correctamente sin duplicar mensajes del emisor.

## 3. Validación y Pruebas de Tiempo Real

- [x] 3.1 Validar que el emisor ve su mensaje aparecer instantáneamente al pulsar enviar (sin recarga).
- [x] 3.2 Confirmar que el receptor recibe el mensaje y la notificación visual de forma síncrona.
- [x] 3.3 Comprobar que los avatares y nombres se renderizan correctamente tanto para mensajes enviados como recibidos en tiempo real.
