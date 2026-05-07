## MODIFIED Requirements

### Requirement: Session Duration Constraint
El sistema SHALL permitir únicamente sesiones de clase con una duración de exactamente 1 hora o exactamente 2 horas.

#### Scenario: Adding valid sessions
- **WHEN** un profesor intenta añadir una sesión de 1 hora o 2 horas
- **THEN** el sistema debe permitir la creación de la sesión si hay horas disponibles en la bolsa

#### Scenario: Adding invalid sessions
- **WHEN** un profesor intenta añadir una sesión de 30 minutos o 1.5 horas
- **THEN** el sistema debe rechazar la operación indicando que solo se permiten sesiones de 1 o 2 horas

### Requirement: Time Block Validation
El sistema SHALL impedir la programación de clases durante el patio (11:00-11:30) y el descanso de comida (15:30-17:00).

#### Scenario: Attempting to schedule during patio
- **WHEN** un profesor intenta colocar una clase que colisione con el rango 11:00-11:30
- **THEN** el sistema debe rechazar la operación

#### Scenario: Attempting to schedule during food break
- **WHEN** un profesor intenta colocar una clase que colisione con el rango 15:30-17:00
- **THEN** el sistema debe rechazar la operación

### Requirement: Session Visual Grid Span
El sistema SHALL representar visualmente el horario en bloques de 1 hora, donde cada celda del grid representa el intervalo desde el inicio de la hora hasta el inicio de la siguiente (ej. 08:00 - 09:00).

#### Scenario: Grid interval representation
- **WHEN** se renderiza el ScheduleEditor
- **THEN** las etiquetas de tiempo deben mostrarse en incrementos de 1 hora (8:00, 9:00, 10:00, etc.)
