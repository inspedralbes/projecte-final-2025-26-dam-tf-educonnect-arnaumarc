## ADDED Requirements

### Requirement: Polymorphic Notifications and Idempotency
El sistema SHALL garantizar que la entrega de mensajes privados sea fiable utilizando notificaciones polimórficas y evitando la duplicidad en el envío y persistencia.

#### Scenario: Idempotent message delivery
- **WHEN** el sistema procesa la entrega de un mensaje privado (a través de REST o WebSockets)
- **THEN** debe utilizar mecanismos de idempotencia (por ejemplo, verificando identificadores únicos o nonce) para asegurar que el mensaje no se registre ni se notifique más de una vez al receptor.

#### Scenario: Polymorphic recipient model
- **WHEN** un mensaje es almacenado o notificado
- **THEN** el sistema debe emplear una referencia polimórfica (`recipientModel`) para admitir de forma flexible la entrega a usuarios, grupos, u otras entidades, utilizando de manera consistente el `_id` como clave primaria de referencia.
