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
