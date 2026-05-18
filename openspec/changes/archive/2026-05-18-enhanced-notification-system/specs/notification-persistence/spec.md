## ADDED Requirements

### Requirement: Database logging for Meet events
El sistema SHALL registrar en la base de datos todas las llamadas de Meet iniciadas y recibidas, así como los mensajes de chat, independientemente del estado de conexión del receptor.

#### Scenario: Missed call logging
- **WHEN** un usuario inicia una llamada a otro que está offline
- **THEN** el sistema debe guardar una notificación de tipo `MEET_CALL` en la base de datos para que el receptor la vea al conectar.

#### Scenario: Real-time chat persistence
- **WHEN** se envía un mensaje por el panel de chat de Meet
- **THEN** el sistema debe guardarlo como una notificación persistente de tipo `MEET_MESSAGE` vinculada al receptor.
