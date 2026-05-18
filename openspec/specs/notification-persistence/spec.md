## ADDED Requirements

### Requirement: Meet Event Persistence
El sistema SHALL garantizar el registro en la base de datos de eventos críticos como MEET_CALL y MEET_MESSAGE antes de su emisión por Sockets para evitar pérdida de información.

#### Scenario: Offline user receives a call
- **WHEN** un usuario recibe una llamada o mensaje de Meet pero está desconectado
- **THEN** el evento se guarda en la base de datos y se muestra como notificación o evento en el historial cuando el usuario se vuelve a conectar.
