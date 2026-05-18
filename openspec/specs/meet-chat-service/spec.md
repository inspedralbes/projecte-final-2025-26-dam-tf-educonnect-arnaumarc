## ADDED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto en tiempo real, incluyendo mensajes directos/privados a un receptor seleccionado. En pantallas de menos de 768px, este panel se comportará como un "overlay" a pantalla completa o modal para no comprimir el vídeo.

#### Scenario: Sending message during call
- **WHEN** un usuario escribe un mensaje en el panel de chat de Meet y pulsa enviar sin destinatario específico
- **THEN** el sistema debe entregar el mensaje instantáneamente a todos los participantes de la llamada.

#### Scenario: Sending private message during call
- **WHEN** un usuario selecciona a un receptor específico y envía un mensaje
- **THEN** el sistema debe entregar el mensaje instantáneamente y de forma privada únicamente a ese receptor seleccionado.

#### Scenario: Chat on small screen
- **WHEN** el usuario abre el chat en una pantalla pequeña
- **THEN** el sistema debe mostrar el chat sobre el vídeo (overlay) en lugar de desplazar el vídeo lateralmente.

### Requirement: Direct Message Continuity
Los mensajes enviados a través del chat de Meet, así como los eventos de llamada, SHALL persistir en el historial de mensajes y notificaciones del usuario para que sean visibles posteriormente.

#### Scenario: Post-call message review
- **WHEN** una llamada finaliza y el alumno vuelve al Tablón o historial
- **THEN** los mensajes recibidos y el registro de la llamada durante el Meet deben aparecer en su registro.

### Requirement: System Events in Chat
El sistema SHALL mostrar eventos automáticos en el chat de Meet (ej: "Usuario X se ha unido", "Usuario Y ha compartido pantalla").

#### Scenario: Joining notification
- **WHEN** un nuevo participante se une a la sesión de Meet
- **THEN** el sistema debe insertar automáticamente un mensaje informativo en el flujo del chat.
