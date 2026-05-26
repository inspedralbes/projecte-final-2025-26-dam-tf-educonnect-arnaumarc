## MODIFIED Requirements

### Requirement: Meet Event Persistence
El sistema SHALL garantizar el registro en la base de datos de eventos críticos como MEET_CALL y MEET_MESSAGE antes de su emisión por Sockets para evitar pérdida de información. El flujo de notificaciones DEBE ser centralizado en el backend, evitando la creación de notificaciones locales o volátiles en el frontend para estos eventos.

#### Scenario: Offline user receives a call
- **WHEN** un usuario recibe una llamada o mensaje de Meet pero está desconectado
- **THEN** el evento se guarda en la base de datos con los metadatos necesarios para su limpieza futura y se muestra como notificación o evento en el historial cuando el usuario se vuelve a conectar.

#### Scenario: Atomic notification delivery
- **WHEN** el backend procesa una llamada entrante
- **THEN** debe persistir la notificación en la base de datos antes de emitir cualquier evento de socket, asegurando que el ID de la notificación sea único y persistente desde el primer momento.
