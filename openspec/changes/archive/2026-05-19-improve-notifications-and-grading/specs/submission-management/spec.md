## MODIFIED Requirements

### Requirement: Submission persistence
El sistema DEBE garantizar que cada entrega quede vinculada de forma única al alumno, la actividad y el curso correspondientes, manteniendo una marca de tiempo inalterable y permitiendo el almacenamiento opcional de una calificación (nota) y comentarios de retroalimentación (feedback).

#### Scenario: Verify submission evaluation data
- **WHEN** se consulta una entrega evaluada
- **THEN** el sistema DEBE mostrar la nota asignada, el feedback del profesor, además del ID del alumno, la actividad y la fecha de entrega.
