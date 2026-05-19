## ADDED Requirements

### Requirement: Sender Immediate Update
El sistema SHALL actualizar la interfaz del emisor inmediatamente después de recibir una confirmación exitosa de la API de que el mensaje ha sido persistido.

#### Scenario: Message sent successfully
- **WHEN** el usuario envía un mensaje y recibe una respuesta 200 OK
- **THEN** el mensaje debe aparecer en la parte inferior de la lista de chats del emisor sin parpadeos ni recargas.

### Requirement: Receiver Real-time Sync
El sistema SHALL entregar el objeto de mensaje completo al receptor a través de WebSockets en el momento exacto de su creación.

#### Scenario: Receiving message in real-time
- **WHEN** un usuario recibe el evento de socket `new_message`
- **THEN** el panel de chat del receptor debe actualizarse automáticamente para mostrar el nuevo mensaje si tiene abierta la conversación con dicho emisor.

## MODIFIED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto en tiempo real. Este panel SHALL estar disponible tanto durante una llamada activa como de forma independiente. En pantallas de menos de 768px, este panel se comportará como un "overlay" a pantalla completa o modal para no comprimir la interfaz principal. Los mensajes SHALL incluir siempre la información de identidad del emisor (nombre y avatar) para su correcta visualización inmediata.

#### Scenario: Sending message independently
- **WHEN** un usuario selecciona un contacto para chat, escribe un mensaje y pulsa enviar
- **THEN** el sistema debe entregar el mensaje instantáneamente al destinatario a través de sockets y confirmar visualmente el envío al emisor de forma inmediata.

#### Scenario: Chat on small screen
- **WHEN** el usuario abre el chat en una pantalla pequeña
- **THEN** el sistema debe mostrar el chat sobre el contenido principal (overlay) en lugar de desplazar el contenido lateralmente.
