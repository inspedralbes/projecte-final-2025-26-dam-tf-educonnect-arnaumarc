## ADDED Requirements

### Requirement: Initial Course Selection
El sistema SHALL seleccionar automáticamente la primera asignatura disponible para el profesor al cargar el editor de horarios, asegurando que el estado interno sea válido desde el inicio.

#### Scenario: Auto-selecting first course
- **WHEN** un profesor abre el portal docente
- **THEN** el selector de asignaturas debe mostrar y tener seleccionada internamente la primera asignatura de su lista.

### Requirement: Normalized Time Format
El sistema SHALL utilizar un formato de hora normalizado `HH:mm` (ej. 08:00) en todos los intercambios de datos y comparaciones lógicas para evitar inconsistencias de formato.

#### Scenario: Matching session ownership
- **WHEN** el frontend recibe una sesión guardada como "08:00"
- **THEN** debe compararla correctamente con su representación interna para habilitar el botón de borrado si el profesor es el propietario.
