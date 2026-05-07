## ADDED Requirements

### Requirement: Classroom Selection
El sistema SHALL permitir al profesor seleccionar entre múltiples aulas disponibles al programar una sesión de clase.

#### Scenario: Selecting a classroom
- **WHEN** un profesor añade una nueva sesión de clase
- **THEN** el sistema debe presentar un selector con la lista de aulas disponibles (Aula 1, Aula 2, Lab 1, etc.)

### Requirement: Multi-Classroom Conflict Prevention
El sistema SHALL validar conflictos de horario por aula de forma independiente.

#### Scenario: Different classrooms at the same time
- **WHEN** se programa una sesión en el Aula 1 de 10:00 a 11:00
- **THEN** el sistema debe permitir programar otra sesión en el Aula 2 de 10:00 a 11:00 sin conflictos
