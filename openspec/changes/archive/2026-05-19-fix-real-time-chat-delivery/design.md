## Context

El sistema de chat de Meet utiliza una combinación de API REST (para persistencia y carga inicial) y WebSockets (para actualizaciones en tiempo real). Actualmente, el emisor de un mensaje no ve su mensaje reflejado en la interfaz hasta que recarga la página, debido a un manejo incorrecto del objeto de respuesta de la API. Además, el receptor no recibe el mensaje en tiempo real porque el backend solo emite una notificación genérica pero no el evento de mensaje específico.

## Goals / Non-Goals

**Goals:**
- Asegurar que el emisor vea su mensaje instantáneamente tras una respuesta exitosa de la API.
- Garantizar que el receptor reciba el mensaje completo por sockets sin necesidad de recargar.
- Estandarizar la estructura de los mensajes emitidos y devueltos para incluir la información del emisor (populated).

**Non-Goals:**
- Implementar confirmaciones de lectura (visto).
- Cambiar la lógica de persistencia en MongoDB.
- Modificar el sistema de videollamada.

## Decisions

### 1. Extracción del mensaje en el Frontend
Se modificará el `ChatPanel.tsx` para extraer `data.message` de la respuesta del `POST /api/messages`.
- **Razón**: La API devuelve un objeto envoltorio `{ success: true, message: { ... } }`. Insertar el objeto envoltorio directamente en la lista de mensajes rompe el renderizado.

### 2. Emisión de `new_message` en el Backend
En `messageController.js`, se añadirá una llamada a `req.io.to(receiverSocketId).emit('new_message', message)`.
- **Razón**: Actualmente solo se emite `new_notification`. El `SocketContext` del frontend escucha específicamente `new_message` para actualizar la lista de chats.

### 3. Población (Populate) del Emisor en el Backend
Se aplicará `.populate('sender', 'nombre apellidos profileImage')` antes de emitir el mensaje y antes de enviarlo como respuesta REST.
- **Razón**: El frontend depende de tener el nombre y la imagen del emisor para renderizar la burbuja del chat correctamente. Sin esto, el mensaje aparece "vacío" o con errores de ID vs Objeto.

## Risks / Trade-offs

- **[Riesgo]** Duplicidad de mensajes si el socket emite al propio emisor y el frontend también lo inserta manualmente. → **Mitigación**: El backend solo emitirá al receptor (`req.io.to(receiverSocketId)`), y el emisor gestionará su propia actualización local tras el éxito del POST.
- **[Riesgo]** Mensajes sin ID temporal en el frontend pueden causar errores de `key` en React. → **Mitigación**: Usar el ID real devuelto por la base de datos tras el POST antes de insertar en el estado.
