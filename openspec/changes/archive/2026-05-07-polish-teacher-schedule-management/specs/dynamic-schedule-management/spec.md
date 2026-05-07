## ADDED Requirements

### Requirement: Operation Feedback
El sistema SHALL proporcionar feedback visual inmediato (ej. notificaciones toast) al usuario tras cada operación de añadir o borrar una sesión de horario, indicando éxito o el motivo del fallo.

#### Scenario: Deleting a session with feedback
- **WHEN** un profesor borra una sesión de clase
- **THEN** el sistema debe mostrar una notificación confirmando la eliminación.
