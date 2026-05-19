## ADDED Requirements

### Requirement: Standalone Direct Messaging in Meet
El sistema SHALL permitir la apertura y uso del panel de chat con cualquier usuario de la lista de Meet sin necesidad de que exista una llamada de video o audio activa.

#### Scenario: Open chat without calling
- **WHEN** el usuario hace clic en el botón de "Chat" de un contacto en la lista de Meet
- **THEN** el panel de chat debe abrirse mostrando el historial de mensajes con dicho contacto y permitiendo el envío de nuevos mensajes, sin disparar ninguna solicitud de llamada.

#### Scenario: Switch chat user during call
- **WHEN** el usuario está en una videollamada con el "Usuario A" y hace clic en el botón de "Chat" del "Usuario B"
- **THEN** el panel de chat debe cambiar para mostrar la conversación con el "Usuario B", manteniendo la videollamada activa con el "Usuario A".
