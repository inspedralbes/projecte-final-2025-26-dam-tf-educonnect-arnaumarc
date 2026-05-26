## ADDED Requirements

### Requirement: User presence tracking
El sistema DEBE rastrear el estado de conexión de cada usuario. Los estados posibles son: ONLINE, OFFLINE y BUSY.

#### Scenario: User logs in
- **WHEN** un usuario se conecta al socket del servidor
- **THEN** su estado cambia a ONLINE y se notifica a todos los contactos.

#### Scenario: User starts a call
- **WHEN** un usuario acepta o inicia una videollamada
- **THEN** su estado cambia a BUSY.

### Requirement: Busy signal handling
El sistema SHALL impedir que un usuario reciba una nueva llamada si su estado es BUSY.

#### Scenario: Calling a busy user
- **WHEN** el Usuario A intenta llamar al Usuario B, y el Usuario B tiene estado BUSY
- **THEN** el sistema debe notificar al Usuario A que el destinatario está ocupado y no emitir la llamada al Usuario B.
