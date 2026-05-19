## MODIFIED Requirements

### Requirement: Direct Message Continuity
Los mensajes enviados a través del chat de Meet, así como los eventos de llamada, SHALL persistir en el historial de mensajes y notificaciones del usuario de forma temporal (24 horas) para que sean visibles posteriormente si la sesión es reciente.

#### Scenario: Post-call message review
- **WHEN** una llamada finaliza y el alumno vuelve al Tablón o historial dentro de las primeras 24 horas
- **THEN** los mensajes recibidos y el registro de la llamada durante el Meet deben aparecer en su registro.

#### Scenario: Message cleanup after 24h
- **WHEN** han pasado más de 24 horas desde la finalización de una sesión de Meet
- **THEN** los mensajes de chat y registros de llamada asociados deben haber sido eliminados automáticamente del historial del usuario.
