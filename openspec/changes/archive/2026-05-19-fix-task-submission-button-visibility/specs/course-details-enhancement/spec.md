## ADDED Requirements

### Requirement: Robust Submission Button Visibility
El sistema SHALL mostrar el botÃ³n "Realizar Entrega" a los alumnos para cualquier recurso que sea de tipo "Tarea" (type: 'task'), incluso si el campo `requiresSubmission` en la base de datos es `false` (para compatibilidad con datos heredados).

#### Scenario: Student views a legacy task
- **WHEN** un alumno visualiza una asignatura que tiene una tarea antigua con `requiresSubmission: false`
- **THEN** el sistema debe mostrar igualmente el botÃ³n "Realizar Entrega".

### Requirement: Automated Submission Flag Enforcement
El frontend SHALL asegurar que al enviar el formulario de creaciÃ³n de recurso o evento, el flag `requiresSubmission` se envÃ­e como `true` si el tipo es una tarea o actividad digital.

#### Scenario: Submitting the resource creation form
- **WHEN** el profesor pulsa "Guardar" en el modal de nuevo recurso
- **THEN** la peticiÃ³n enviada a la API debe incluir `requiresSubmission: true` si el `type` es `'task'`.
