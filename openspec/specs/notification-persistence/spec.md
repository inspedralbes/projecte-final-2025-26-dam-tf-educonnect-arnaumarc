# Notification Persistence Specification

## Requirements

### Requirement: Meet Event Persistence
El sistema SHALL garantizar el registro en la base de datos de eventos críticos como MEET_CALL y MEET_MESSAGE antes de su emisión por Sockets para evitar pérdida de información. Además, estas notificaciones DEBEN incluir una marca de tiempo precisa y metadatos que faciliten su expiración automática.

#### Scenario: Offline user receives a call
- **WHEN** un usuario recibe una llamada o mensaje de Meet pero está desconectado
- **THEN** el evento se guarda en la base de datos con los metadatos necesarios para su limpieza futura y se muestra como notificación o evento en el historial cuando el usuario se vuelve a conectar.

### Requirement: Resource Reference in Notifications
El esquema de notificaciones SHALL incluir un campo opcional `sourceId` para vincular avisos a recursos académicos específicos (Topic, Resource, Exam).

#### Scenario: Notification linking to exam
- **WHEN** se crea una notificación de tipo EXAM
- **THEN** el sistema debe almacenar el ID del examen en el campo `sourceId` para permitir futuras operaciones de borrado sincronizado.
