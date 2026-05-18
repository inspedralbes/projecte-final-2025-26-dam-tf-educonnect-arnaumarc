## ADDED Requirements

### Requirement: Polymorphic Notifications for Messages
El sistema SHALL crear notificaciones persistentes que referencien correctamente al modelo de usuario (Alumno o Profesor) basándose en el rol del receptor.

#### Scenario: Message to Professor
- **WHEN** un alumno envía un mensaje privado a un profesor
- **THEN** el sistema crea una notificación cuyo `recipientModel` es 'Professor' y el ID apunta al profesor correcto.

#### Scenario: Message to Student
- **WHEN** un profesor envía un mensaje privado a un alumno
- **THEN** el sistema crea una notificación cuyo `recipientModel` es 'Alumno' y el ID apunta al alumno correcto.

### Requirement: Idempotent Message Delivery
El sistema SHALL garantizar que no existan duplicados de mensajes en la interfaz de usuario, independientemente de si el mensaje llega por respuesta HTTP o evento de Socket.

#### Scenario: Sender message sync
- **WHEN** el emisor recibe el mensaje por el canal de Socket después de haberlo añadido vía respuesta HTTP
- **THEN** el sistema debe ignorar el evento de Socket si el `_id` del mensaje ya existe en el estado local.

### Requirement: Consistent User Identification
El sistema SHALL utilizar identificadores de usuario consistentes (`_id`) en todos los componentes del chat para evitar fallos de emparejamiento de mensajes.

#### Scenario: Identifying message sender
- **WHEN** se renderiza un mensaje en el `ChatPanel`
- **THEN** el sistema debe comparar el `_id` del emisor con el del usuario actual de forma directa, sin transformaciones de ID intermedias.
