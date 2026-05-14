## MODIFIED Requirements

### Requirement: Simplified Resource Categories
El sistema SHALL simplificar los tipos de recursos a dos categorías principales: "Material" (para contenidos teóricos) y "Tarea" (para actividades prácticas). Para las tareas, el sistema DEBE permitir configurar el tipo de entrega requerido.

#### Scenario: Selecting resource type and submission method
- **WHEN** el profesor abre el modal para añadir un recurso y selecciona "Tarea"
- **THEN** el sistema debe permitir elegir entre "Solo marcar como completado", "Escribir comentario" o "Subir archivo".

### Requirement: Optional Task Deadlines
El sistema SHALL permitir establecer una fecha límite de entrega para los recursos de tipo "Tarea". Esta fecha debe ser opcional y servirá de base para el cálculo de puntualidad en el sistema de seguimiento.

#### Scenario: Setting a deadline for a task
- **WHEN** un profesor crea una "Tarea" y selecciona una fecha en el campo opcional "Fecha Límite"
- **THEN** el sistema debe mostrar dicha fecha en la vista del alumno y usarla para marcar entregas como "A TIEMPO" o "TARDE".

#### Scenario: Task without deadline
- **WHEN** un profesor crea una "Tarea" y deja vacío el campo de "Fecha Límite"
- **THEN** el sistema debe guardar la tarea sin restricciones de tiempo y tratar todas las entregas como "A TIEMPO".
