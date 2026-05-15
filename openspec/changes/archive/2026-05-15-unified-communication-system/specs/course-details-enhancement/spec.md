## ADDED Requirements

### Requirement: Standardized Bulk Notification Meta
El sistema SHALL asegurar que los avisos enviados masivamente a toda la clase desde la vista de detalle del curso incluyan metadatos de contexto (`courseId`).

#### Scenario: Sending class announcement
- **WHEN** un profesor usa la función "Aviso a toda la clase" desde el detalle de la asignatura
- **THEN** la notificación resultante debe llevar el `courseId` poblado para que aparezca correctamente en la pestaña "Clase" del Tablón del alumno.
