# Notification Persistence Specification

## Requirements

### Requirement: Meet Event Persistence
El sistema SHALL garantizar el registro en la base de datos de eventos críticos como MEET_CALL y MEET_MESSAGE antes de su emisión por Sockets para evitar pérdida de información. El flujo de notificaciones DEBE ser centralizado en el backend, evitando la creación de notificaciones locales o volátiles en el frontend para estos eventos. Además, estas notificaciones DEBEN incluir una marca de tiempo precisa y metadatos que faciliten su expiración automática. El historial de notificaciones no leídas DEBE ser entregado exclusivamente a través de la API REST durante el inicio de la sesión del cliente, evitando re-emisiones por Socket que causen duplicidad.

#### Scenario: Offline user receives a call
- **WHEN** un usuario recibe una llamada o mensaje de Meet pero está desconectado
- **THEN** el evento se guarda en la base de datos con los metadatos necesarios para su limpieza futura y se muestra como notificación o evento en el historial cuando el usuario se vuelve a conectar a través de la carga inicial de datos.

#### Scenario: Atomic notification delivery
- **WHEN** el backend procesa una llamada entrante
- **THEN** debe persistir la notificación en la base de datos antes de emitir cualquier evento de socket, asegurando que el ID de la notificación sea único y persistente desde el primer momento.

### Requirement: Resource Reference in Notifications
El esquema de notificaciones SHALL incluir un campo opcional `sourceId` para vincular avisos a recursos académicos específicos (Topic, Resource, Exam) y un campo `link` para permitir la navegación directa (deep linking).

#### Scenario: Notification linking to exam
- **WHEN** se crea una notificación de tipo EXAM
- **THEN** el sistema debe almacenar el ID del examen en el campo `sourceId` para permitir futuras operaciones de borrado sincronizado y generar una URL de navegación en el campo `link`.
