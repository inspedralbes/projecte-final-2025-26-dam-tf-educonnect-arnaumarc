# Notification Lifecycle Management Specification

## Requirements

### Requirement: Meet Notification Auto-Expiration
El sistema SHALL eliminar automáticamente las notificaciones de tipo MEET_CALL y MEET_MESSAGE una vez transcurridas 24 horas desde su creación.

#### Scenario: Automatic cleanup of old Meet notifications
- **WHEN** un proceso de limpieza periódica detecta notificaciones de Meet con una antigüedad superior a 24 horas
- **THEN** el sistema las elimina permanentemente de la base de datos sin intervención del usuario.

### Requirement: Cascading Resource Cleanup
El sistema SHALL eliminar las notificaciones asociadas a recursos académicos (exámenes, materiales, tareas) cuando el recurso original es eliminado por el profesor.

#### Scenario: Professor deletes an exam
- **WHEN** un profesor elimina un examen del temario del curso
- **THEN** el sistema identifica y elimina automáticamente todas las notificaciones de tipo EXAM asociadas a ese `sourceId` específico de todos los alumnos inscritos.
