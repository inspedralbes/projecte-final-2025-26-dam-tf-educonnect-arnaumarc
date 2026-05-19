## MODIFIED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto en tiempo real. Este panel SHALL estar disponible tanto durante una llamada activa como de forma independiente. En pantallas de menos de 768px, este panel se comportará como un "overlay" a pantalla completa o modal para no comprimir la interfaz principal.

#### Scenario: Sending message independently
- **WHEN** un usuario selecciona un contacto para chat, escribe un mensaje y pulsa enviar
- **THEN** el sistema debe entregar el mensaje instantáneamente al destinatario a través de sockets o API REST, según disponibilidad.

#### Scenario: Chat on small screen
- **WHEN** el usuario abre el chat en una pantalla pequeña
- **THEN** el sistema debe mostrar el chat sobre el contenido principal (overlay) en lugar de desplazar el contenido lateralmente.
