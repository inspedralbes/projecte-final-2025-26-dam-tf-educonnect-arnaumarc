## ADDED Requirements

### Requirement: Session Visual Grid Span
El sistema SHALL representar visualmente la duración de las sesiones en el grid de horarios ocupando exactamente una fila por cada 30 minutos de duración.

#### Scenario: Visual span of 1 hour session
- **WHEN** una sesión de 1 hora se renderiza en el ScheduleEditor
- **THEN** la tarjeta de la sesión debe ocupar exactamente 2 filas del grid (cada fila = 30 min)

#### Scenario: Visual span of 2.5 hour session
- **WHEN** una sesión de 2.5 horas se renderiza en el ScheduleEditor
- **THEN** la tarjeta de la sesión debe ocupar exactamente 5 filas del grid (cada fila = 30 min)

## MODIFIED Requirements

### Requirement: Session Duration Constraint
El sistema SHALL permitir sesiones de clase con una duración mínima de 30 minutos y máxima de 2.5 horas, en incrementos de 30 minutos.

#### Scenario: Adding sessions of varying durations
- **WHEN** un profesor intenta añadir una sesión de 0.5, 1, 1.5, 2 o 2.5 horas
- **THEN** el sistema debe permitir la creación de la sesión si hay horas disponibles en la bolsa

### Requirement: Single Classroom Management
El sistema SHALL gestionar exclusivamente una única aula ("Aula Única"), eliminando cualquier selector o gestión de múltiples espacios en la interfaz de usuario y asegurando que no existan solapamientos horarios en dicho espacio.

#### Scenario: Fixed classroom assignment
- **WHEN** se crea una sesión de horario
- **THEN** el sistema debe asignar automáticamente el valor "Aula Única" al campo classroom sin intervención del usuario e impedir solapamientos con otras sesiones en el mismo horario.
