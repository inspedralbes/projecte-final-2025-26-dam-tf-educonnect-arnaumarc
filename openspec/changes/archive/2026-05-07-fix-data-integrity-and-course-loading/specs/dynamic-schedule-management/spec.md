## MODIFIED Requirements

### Requirement: Course Filtering Resilience
El sistema SHALL filtrar las asignaturas del profesor comparando los IDs de forma robusta, asegurando que los tipos de datos (ObjectId vs String) no impidan el filtrado correcto.

#### Scenario: Loading courses for logged-in professor
- **WHEN** un profesor con ID "123" carga su dashboard
- **THEN** el sistema debe mostrar solo los cursos donde el campo `professor` coincida con "123" tras normalizar ambos a strings.
