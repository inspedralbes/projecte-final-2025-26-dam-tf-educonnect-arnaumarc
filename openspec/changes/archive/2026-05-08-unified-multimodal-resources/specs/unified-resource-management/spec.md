## ADDED Requirements

### Requirement: Multimodal Resource Structure
El sistema SHALL permitir que un recurso individual contenga simultáneamente un título, una descripción detallada, un enlace web externo y un archivo adjunto.

#### Scenario: Creating a complete material
- **WHEN** un profesor crea un recurso de tipo "Material" completando el título, la descripción, la URL y adjuntando un archivo
- **THEN** el sistema debe guardar y mostrar todos estos componentes dentro de la misma entrada del tema.

### Requirement: Simplified Resource Categories
El sistema SHALL simplificar los tipos de recursos a dos categorías principales: "Material" (para contenidos teóricos) y "Tarea" (para actividades prácticas).

#### Scenario: Selecting resource type
- **WHEN** el profesor abre el modal para añadir un recurso
- **THEN** el sistema debe ofrecer únicamente las opciones de "Material" y "Tarea", permitiendo en ambas la inclusión de múltiples medios.

### Requirement: Optional Task Deadlines
El sistema SHALL permitir establecer una fecha límite de entrega para los recursos de tipo "Tarea". Esta fecha debe ser opcional.

#### Scenario: Setting a deadline for a task
- **WHEN** un profesor crea una "Tarea" y selecciona una fecha en el campo opcional "Fecha Límite"
- **THEN** el sistema debe mostrar dicha fecha en la vista del alumno asociada a esa tarea.

#### Scenario: Task without deadline
- **WHEN** un profesor crea una "Tarea" y deja vacío el campo de "Fecha Límite"
- **THEN** el sistema debe guardar la tarea sin restricciones de tiempo y no mostrar ninguna fecha límite.
