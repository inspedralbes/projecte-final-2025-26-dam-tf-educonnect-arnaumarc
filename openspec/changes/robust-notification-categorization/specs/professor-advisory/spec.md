## ADDED Requirements

### Requirement: Direct Professor Advisory
El sistema SHALL permitir que los profesores envíen avisos directos a alumnos específicos que no estén necesariamente vinculados a una asignatura en particular. Estos avisos deben tener una prioridad visual alta.

#### Scenario: Professor sends personal alert
- **WHEN** un profesor envía un aviso directo a un alumno a través del tipo `PROFESSOR_ADVISORY`
- **THEN** el sistema debe mostrar este aviso en la pestaña "Personal" del Tablón del alumno con un icono distintivo de profesor.

### Requirement: Priority-Based Advisory
Los avisos directos del profesor SHALL poder marcarse con un nivel de prioridad (Baja o Alta). Los de prioridad alta deben resaltar visualmente sobre el resto de notificaciones.

#### Scenario: High priority advisory
- **WHEN** el profesor envía un aviso marcado como prioridad "Alta"
- **THEN** el sistema debe aplicar un estilo de resaltado (ej: borde de color o fondo levemente distinto) en el feed del alumno.
