## MODIFIED Requirements

### Requirement: Direct Message Continuity
Los mensajes enviados a través del chat de Meet SHALL persistir en el historial de mensajes del usuario para que sean visibles posteriormente en el Tablón. Además, el sistema SHALL registrar eventos de llamada iniciada y finalizada en la base de datos de notificaciones.

#### Scenario: Post-call message review
- **WHEN** una llamada finaliza y el alumno vuelve al Tablón
- **THEN** los mensajes recibidos durante el Meet deben aparecer en la pestaña "Personal" o "Clase" según el contexto del mensaje.

#### Scenario: Call event persistence
- **WHEN** un profesor inicia una llamada de Meet
- **THEN** se crea una notificación persistente `MEET_CALL` vinculada al alumno para su consulta posterior.
