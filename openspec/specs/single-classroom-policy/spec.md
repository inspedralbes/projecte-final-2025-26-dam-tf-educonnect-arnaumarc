## Capability: Single Classroom Policy

Esta capacidad define la política de uso de un espacio único para todo el centro, asegurando la cohesión y evitando conflictos de recursos.

### Requirement: Unified Group Policy
El sistema SHALL garantizar que cada asignatura se imparta a un grupo único de alumnos sin divisiones (ej. desdobles, grupos A/B). Todas las horas lectivas de una asignatura ocurren simultáneamente para todos los alumnos inscritos.

#### Scenario: Scheduling for the whole class
- **WHEN** un profesor programa una hora de clase
- **THEN** esa sesión se aplica a la totalidad del grupo de alumnos inscritos sin posibilidad de crear sesiones paralelas para subgrupos.

### Requirement: Enforcement of "Aula Única"
El sistema SHALL forzar que el 100% de la actividad docente ocurra en un espacio centralizado denominado "Aula Única".

#### Scenario: Verification of classroom field
- **WHEN** se consulta cualquier sesión de horario en la base de datos o API
- **THEN** el campo `classroom` siempre debe contener el valor literal "Aula Única", independientemente del curso o profesor.
