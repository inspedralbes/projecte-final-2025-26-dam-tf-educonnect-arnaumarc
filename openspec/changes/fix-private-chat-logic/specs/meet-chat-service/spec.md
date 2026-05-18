## MODIFIED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto privados en tiempo real. En pantallas de menos de 768px, este panel se comportará como un "overlay" a pantalla completa o modal para no comprimir el vídeo.

#### Scenario: Sending message during call
- **WHEN** un usuario escribe un mensaje en el panel de chat de Meet a un participante específico y pulsa enviar
- **THEN** el sistema debe entregar el mensaje instantáneamente al receptor seleccionado y al emisor para sincronización.

#### Scenario: Chat on small screen
- **WHEN** el usuario abre el chat en una pantalla pequeña
- **THEN** el sistema debe mostrar el chat sobre el vídeo (overlay) en lugar de desplazar el vídeo lateralmente.
