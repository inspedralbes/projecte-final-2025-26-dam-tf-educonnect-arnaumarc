## ADDED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto en tiempo real.

#### Scenario: Sending message during call
- **WHEN** un usuario escribe un mensaje en el panel de chat de Meet y pulsa enviar
- **THEN** el sistema debe entregar el mensaje instantáneamente a todos los participantes de la llamada.

### Requirement: Direct Message Continuity
Los mensajes enviados a través del chat de Meet SHALL persistir en el historial de mensajes del usuario para que sean visibles posteriormente en el Tablón.

#### Scenario: Post-call message review
- **WHEN** una llamada finaliza y el alumno vuelve al Tablón
- **THEN** los mensajes recibidos durante el Meet deben aparecer en la pestaña "Personal" o "Clase" según el contexto del mensaje.

### Requirement: System Events in Chat
El sistema SHALL mostrar eventos automáticos en el chat de Meet (ej: "Usuario X se ha unido", "Usuario Y ha compartido pantalla").

#### Scenario: Joining notification
- **WHEN** un nuevo participante se une a la sesión de Meet
- **THEN** el sistema debe insertar automáticamente un mensaje informativo en el flujo del chat.
