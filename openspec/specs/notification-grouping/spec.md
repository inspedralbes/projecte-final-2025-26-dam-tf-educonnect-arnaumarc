## Requirements

### Requirement: Sender-Based Feed Grouping
El sistema SHALL permitir la agrupación de elementos del feed basándose en el identificador único del remitente (`sender._id`) además del tipo de evento y la ventana temporal.

#### Scenario: Multiple messages from same sender
- **WHEN** un usuario recibe múltiples eventos del mismo tipo y del mismo remitente en un periodo corto
- **THEN** el sistema debe ser capaz de colapsarlos en un único grupo identificado por el nombre del remitente.

### Requirement: Same-Day Grouping Policy for Real-Time Events
El sistema SHALL agrupar eventos de alta frecuencia (como chat o llamadas) que ocurran dentro del mismo día natural (mismo "date string").

#### Scenario: Chat activity throughout the day
- **WHEN** se reciben mensajes de Meet a las 10:00 y a las 15:00 del mismo día por el mismo profesor
- **THEN** el sistema debe incluirlos en el mismo grupo diario del remitente.
