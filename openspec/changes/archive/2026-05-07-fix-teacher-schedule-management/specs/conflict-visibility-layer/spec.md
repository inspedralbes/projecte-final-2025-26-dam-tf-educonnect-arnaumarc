## ADDED Requirements

### Requirement: Occupancy Visualization
El sistema SHALL mostrar visualmente en el grid de horario qué huecos están ya ocupados en el aula seleccionada, incluso si las sesiones pertenecen a otros profesores o cursos.

#### Scenario: Visualizing occupied slots
- **WHEN** un profesor selecciona un aula específica en el editor
- **THEN** el sistema debe cargar y mostrar en color gris (u otro indicador de bloqueo) las sesiones existentes de otros cursos en esa misma aula

### Requirement: Real-time Conflict Feedback
El sistema SHALL actualizar la vista de conflictos inmediatamente al cambiar de aula en el selector.

#### Scenario: Switching classrooms
- **WHEN** un profesor cambia del Aula 1 al Aula 2 en el selector
- **THEN** el grid debe actualizarse para mostrar los huecos ocupados específicamente en el Aula 2
