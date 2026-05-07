## MODIFIED Requirements

### Requirement: Single Classroom Management
El sistema SHALL gestionar exclusivamente una única aula ("Aula Única") y un grupo único por curso, eliminando cualquier selector o gestión de múltiples espacios o divisiones de grupo en la interfaz de usuario. El sistema DEBE impedir cualquier solapamiento horario de sesiones, ya que solo existe un espacio físico y un grupo de alumnos disponible.

#### Scenario: Single Classroom Assignment and Overlap Prevention
- **WHEN** se crea una sesión de horario
- **THEN** el sistema debe asignar automáticamente el valor "Aula Única" al campo classroom e impedir solapamientos temporales con cualquier otra sesión existente, garantizando la integridad del horario de grupo único.
