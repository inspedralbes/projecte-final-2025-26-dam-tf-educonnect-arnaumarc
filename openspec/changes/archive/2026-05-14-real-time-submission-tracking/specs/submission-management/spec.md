## ADDED Requirements

### Requirement: Flexible submission types
El sistema DEBE permitir a los alumnos realizar entregas de tres tipos diferentes, según lo configurado por el profesor: subir un archivo, escribir un comentario, o simplemente marcar como completado.

#### Scenario: File submission
- **WHEN** un alumno sube un archivo para una tarea configurada como tipo "archivo"
- **THEN** el sistema guarda la referencia del archivo y notifica al profesor la nueva entrega.

#### Scenario: Comment submission
- **WHEN** un alumno escribe un comentario de confirmación para una tarea de tipo "comentario"
- **THEN** el sistema guarda el texto y marca la tarea como entregada.

### Requirement: Submission persistence
El sistema DEBE garantizar que cada entrega quede vinculada de forma única al alumno, la actividad y el curso correspondientes, manteniendo una marca de tiempo inalterable.

#### Scenario: Verify submission data
- **WHEN** se consulta una entrega realizada
- **THEN** el sistema DEBE mostrar el ID del alumno, el ID de la actividad, el contenido de la entrega y la fecha exacta en la que se realizó.

### Requirement: Secure Identity Validation
El sistema DEBE validar que el alumno que realiza la entrega es realmente quien dice ser, comparando su ID con el del token de sesión.

#### Scenario: Identity spoofing prevention
- **WHEN** un usuario intenta enviar una entrega con un `studentId` diferente al de su token de sesión
- **THEN** el sistema DEBE rechazar la petición con un error 403 Forbidden.

### Requirement: Re-submission Confirmation
El sistema DEBE solicitar una confirmación explícita al alumno si intenta realizar una entrega para una actividad que ya ha entregado anteriormente.

#### Scenario: Confirming re-submission
- **WHEN** un alumno pulsa "Entregar" en una actividad que ya tiene una entrega registrada
- **THEN** el sistema DEBE mostrar un modal de advertencia indicando que la entrega anterior será sobrescrita.
