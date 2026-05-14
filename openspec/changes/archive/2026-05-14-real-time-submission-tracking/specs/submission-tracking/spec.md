## ADDED Requirements

### Requirement: Real-time submission tracking
El sistema DEBE permitir a los profesores ver el estado de las entregas de una actividad en tiempo real, actualizando la lista de alumnos sin necesidad de recargar la página cuando se produce una nueva entrega.

#### Scenario: New submission received
- **WHEN** un alumno realiza una entrega para una actividad específica
- **THEN** el panel de seguimiento del profesor se actualiza instantáneamente moviendo al alumno de la lista de "Pendientes" a la lista de "Completados" o "Tarde".

### Requirement: Categorization of student submissions
El sistema DEBE clasificar a los alumnos en tres categorías para cada actividad: "Pendiente" (no han entregado), "A tiempo" (entrega dentro del plazo) y "Fuera de plazo" (entrega después de la fecha límite).

#### Scenario: Categorizing a late submission
- **WHEN** un alumno entrega una actividad después de la `dueDate` configurada
- **THEN** el sistema marca la entrega como "TARDE" y aparece resaltada en el panel del profesor.
