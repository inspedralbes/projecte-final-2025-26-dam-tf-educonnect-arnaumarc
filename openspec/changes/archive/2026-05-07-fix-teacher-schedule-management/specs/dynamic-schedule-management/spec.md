## MODIFIED Requirements

### Requirement: Session Duration Constraint
El sistema SHALL permitir sesiones de clase con una duración mínima de 30 minutos y máxima de 2.5 horas, permitiendo ajustes finos para cubrir huecos tras periodos de descanso.

#### Scenario: Adding a session with fractional duration
- **WHEN** un profesor intenta añadir una sesión de 1.5 horas (ej. 11:30 a 13:00)
- **THEN** el sistema debe permitir la creación de la sesión si hay horas disponibles en la bolsa y no hay conflictos

## REMOVED Requirements

### Requirement: Single Classroom Conflict Prevention
**Reason**: Reemplazado por `Multi-Classroom Conflict Prevention` en la nueva capacidad `multi-classroom-management`.
**Migration**: Usar la nueva lógica de validación que incluye el ID del aula.
