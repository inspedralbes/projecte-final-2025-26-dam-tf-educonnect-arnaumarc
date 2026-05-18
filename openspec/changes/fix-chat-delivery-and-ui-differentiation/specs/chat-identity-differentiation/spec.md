## ADDED Requirements

### Requirement: Multi-instance Message Delivery
El sistema SHALL entregar mensajes en tiempo real a todas las pestañas y dispositivos activos donde el usuario haya iniciado sesión.

#### Scenario: User has multiple tabs open
- **WHEN** el usuario recibe un mensaje de chat
- **THEN** el mensaje debe aparecer instantáneamente en todas las pestañas abiertas del navegador.

### Requirement: Visual Identity Distinction
El sistema SHALL aplicar estilos visuales distintos y alineaciones opuestas para los mensajes del remitente frente a los del destinatario.

#### Scenario: Rendering chat history
- **WHEN** la interfaz dibuja un mensaje enviado por el usuario actual
- **THEN** la burbuja debe estar alineada a la derecha y tener un color azul.
- **WHEN** la interfaz dibuja un mensaje recibido de otro usuario
- **THEN** la burbuja debe estar alineada a la izquierda y tener un color gris.

## MODIFIED Requirements

### Requirement: Integrated Meet Chat Panel
El sistema SHALL proporcionar un panel lateral de chat dentro de la vista de Meet que permita el intercambio de mensajes de texto en tiempo real. Este panel SHALL estar disponible tanto durante una llamada activa como de forma independiente. En pantallas de menos de 768px, este panel se comportará como un "overlay" a pantalla completa o modal para no comprimir la interfaz principal. Los mensajes SHALL incluir siempre la información de identidad del emisor (nombre y avatar) y SHALL compararse contra el ID del usuario local utilizando una lógica de conversión a string para evitar falsos negativos en la diferenciación visual.

#### Scenario: Message comparison integrity
- **WHEN** el sistema compara el remitente de un mensaje con el usuario actual
- **THEN** debe utilizar una función de normalización de ID para asegurar que `ObjectId("abc")` sea igual a `"abc"`.
