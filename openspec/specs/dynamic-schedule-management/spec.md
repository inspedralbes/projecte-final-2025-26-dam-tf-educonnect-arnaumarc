## ADDED Requirements

### Requirement: Weekly Hour Purse
El sistema SHALL permitir definir una bolsa de entre 4 y 6 horas semanales para cada asignatura.

#### Scenario: Defining weekly hours
- **WHEN** un profesor configura una asignatura
- **THEN** el sistema debe permitir establecer el total de horas semanales entre 4 y 6

### Requirement: Session Duration Constraint
El sistema SHALL permitir únicamente sesiones de clase de 1 o 2 horas de duración.

#### Scenario: Adding a valid session
- **WHEN** un profesor intenta añadir una sesión de 1 o 2 horas
- **THEN** el sistema debe permitir la creación de la sesión si hay horas disponibles en la bolsa

### Requirement: Time Block Validation
El sistema SHALL impedir la programación de clases durante el patio (11:00-11:30) y el descanso de comida (14:00-15:00).

#### Scenario: Attempting to schedule during patio
- **WHEN** un profesor intenta colocar una clase que empiece o termine dentro del rango 11:00-11:30
- **THEN** el sistema debe rechazar la operación con un mensaje de error explicativo

### Requirement: Single Classroom Conflict Prevention
El sistema SHALL impedir que dos sesiones de clase coincidan en el mismo día y rango horario, dado que solo existe una única aula disponible.

#### Scenario: Detecting classroom overlap
- **WHEN** se intenta guardar una sesión de 10:00 a 12:00 y ya existe otra de 11:30 a 12:30 para ese día
- **THEN** el sistema debe bloquear el guardado indicando que el aula ya está ocupada
