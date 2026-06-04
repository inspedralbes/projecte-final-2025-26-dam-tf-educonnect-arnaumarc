## MODIFIED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto en tiempo real. Este panel SHALL estar disponible tanto durante una llamada activa como de forma independiente. En pantallas de menos de 768px, este panel se comportará como un "overlay" a pantalla completa o modal para no comprimir la interfaz principal. Los mensajes SHALL incluir siempre la información de identidad del emisor (nombre y avatar) para su correcta visualización inmediata. El sistema SHALL permitir que cualquier usuario (independientemente de si es alumno o profesor) inicie un chat o llamada con cualquier otro usuario conectado.

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

#### Scenario: Student calling another student
- **WHEN** un alumno selecciona a otro alumno en la lista de Meet y pulsa "Video"
- **THEN** el sistema debe iniciar el proceso de señalización WebRTC entre ambos alumnos de forma idéntica a como lo hace con un profesor.
