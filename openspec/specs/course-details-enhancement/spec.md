## ADDED Requirements

### Requirement: Professor Name Visibility
El sistema SHALL mostrar el nombre y apellidos completos del profesor en todas las vistas de detalle de asignatura, evitando el uso de IDs técnicos o nombres genéricos.

#### Scenario: Viewing course details as student
- **WHEN** un estudiante abre el detalle de una asignatura matriculada
- **THEN** el sistema debe mostrar "Nombre Apellidos" del profesor obtenido del objeto poblado en la respuesta de la API.

### Requirement: Class Members Visibility
El sistema SHALL permitir que todos los usuarios matriculados en una asignatura puedan ver la lista de sus compañeros (miembros de la clase).

#### Scenario: Accessing class members as student
- **WHEN** un estudiante accede a la pestaña de información o miembros de una asignatura
- **THEN** el sistema debe mostrar una lista visual con los avatares y nombres de los demás estudiantes matriculados en la misma asignatura.

### Requirement: Enriched Professor Info
El sistema SHALL mostrar la especialidad y el correo electrónico del profesor dentro de la pestaña de información de la asignatura.

#### Scenario: Viewing professor specialty
- **WHEN** el usuario consulta la información de la asignatura
- **THEN** el sistema debe mostrar una tarjeta con la especialidad del profesor (ej: "Desarrollo de Software") y su email de contacto.

### Requirement: Academic Load Visibility
El sistema SHALL mostrar el total de horas semanales de la asignatura.

#### Scenario: Checking course intensity
- **WHEN** el usuario abre la pestaña de información
- **THEN** el sistema debe indicar claramente el número de horas semanales totales asignadas al curso.

### Requirement: Removal of Static Evaluation Data
El sistema SHALL eliminar las secciones de evaluación con datos estáticos (40%/60%) que no corresponden a la realidad de la asignatura.

#### Scenario: Browsing course information
- **WHEN** el usuario consulta la pestaña de "Información" de la asignatura
- **THEN** el sistema no debe mostrar barras de progreso de evaluación estáticas, sustituyéndolas por el bloque de miembros de la clase.
