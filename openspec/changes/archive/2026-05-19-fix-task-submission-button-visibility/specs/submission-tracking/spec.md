## MODIFIED Requirements

### Requirement: Categorization of student submissions
El sistema DEBE clasificar a los alumnos en tres categorÃ­as para cada actividad: "Pendiente" (no han entregado), "A tiempo" (entrega dentro del plazo) y "Fuera de plazo" (entrega despuÃ©s de la fecha lÃ­mite). El sistema SHALL garantizar que cualquier actividad marcada como "Tarea" (type: 'task') o "Actividad/Examen Digital" siempre permita el seguimiento de entregas, independientemente de la configuraciÃ³n manual del campo `requiresSubmission`.

#### Scenario: Categorizing a late submission
- **WHEN** un alumno entrega una actividad despuÃ©s de la `dueDate` configurada
- **THEN** el sistema marca la entrega como "TARDE" y aparece resaltada en el panel del profesor.

## ADDED Requirements

### Requirement: Guaranteed Submission Lifecycle for Tasks
El sistema SHALL forzar que cualquier recurso de tipo "Tarea" o evento de tipo "Actividad Digital" o "Examen Digital" tenga habilitada la capacidad de recibir entregas por parte de los alumnos.

#### Scenario: Creating a task without manual delivery selection
- **WHEN** un profesor crea una nueva "Tarea / Ejercicio" sin seleccionar explÃ­citamente un tipo de entrega en el modal
- **THEN** el sistema debe guardar la tarea con `requiresSubmission: true` y `submissionType: 'done'` por defecto.
