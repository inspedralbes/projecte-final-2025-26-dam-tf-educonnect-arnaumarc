## ADDED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto en tiempo real. Este panel SHALL estar disponible tanto durante una llamada activa como de forma independiente. En pantallas de menos de 768px, este panel se comportará como un "overlay" a pantalla completa o modal para no comprimir la interfaz principal. Los mensajes SHALL incluir siempre la información de identidad del emisor (nombre y avatar) para su correcta visualización inmediata.

#### Scenario: Sending message during call
- **WHEN** un usuario escribe un mensaje en el panel de chat de Meet y pulsa enviar sin destinatario específico
- **THEN** el sistema debe entregar el mensaje instantáneamente a todos los participantes de la llamada.

#### Scenario: Sending private message during call
- **WHEN** un usuario selecciona a un receptor específico y envía un mensaje
- **THEN** el sistema debe entregar el mensaje instantáneamente y de forma privada únicamente a ese receptor seleccionado.

#### Scenario: Sending message independently
- **WHEN** un usuario selecciona un contacto para chat, escribe un mensaje y pulsa enviar
- **THEN** el sistema debe entregar el mensaje instantáneamente al destinatario a través de sockets y confirmar visualmente el envío al emisor de forma inmediata.

#### Scenario: Chat on small screen
- **WHEN** el usuario abre el chat en una pantalla pequeña
- **THEN** el sistema debe mostrar el chat sobre el contenido principal (overlay) en lugar de desplazar el contenido lateralmente.

### Requirement: Direct Message Continuity
Los mensajes enviados a través del chat de Meet, así como los eventos de llamada, SHALL persistir en el historial de mensajes y notificaciones del usuario de forma temporal (24 horas) para que sean visibles posteriormente si la sesión es reciente.

#### Scenario: Post-call message review
- **WHEN** una llamada finaliza y el alumno vuelve al Tablón o historial dentro de las primeras 24 horas
- **THEN** los mensajes recibidos y el registro de la llamada durante el Meet deben aparecer en su registro.

#### Scenario: Message cleanup after 24h
- **WHEN** han pasado más de 24 horas desde la finalización de una sesión de Meet
- **THEN** los mensajes de chat y registros de llamada asociados deben haber sido eliminados automáticamente del historial del usuario.

### Requirement: System Events in Chat
El sistema SHALL mostrar eventos automáticos en el chat de Meet (ej: "Usuario X se ha unido", "Usuario Y ha compartido pantalla").

#### Scenario: Joining notification
- **WHEN** un nuevo participante se une a la sesión de Meet
- **THEN** el sistema debe insertar automáticamente un mensaje informativo en el flujo del chat.
