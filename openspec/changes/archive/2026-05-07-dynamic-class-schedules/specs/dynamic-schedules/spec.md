## ADDED Requirements

### Requirement: Filtrado robusto en calendario semanal
El sistema DEBE filtrar las sesiones de clase en el calendario semanal comparando correctamente los IDs de curso del usuario con los IDs de las sesiones del horario, independientemente de si son ObjectIDs de MongoDB o strings de prueba.

#### Scenario: Usuario real visualiza su horario
- **WHEN** un usuario autenticado con ObjectIDs en sus cursos inscritos accede a la vista de asignaturas
- **THEN** el calendario semanal DEBE mostrar únicamente las sesiones cuyos `courseId` coincidan exactamente con los IDs de los cursos del usuario.

### Requirement: Carga dinámica de horarios por asignatura
El sistema DEBE permitir la consulta de los horarios de una asignatura específica a través de la API y mostrarlos de forma dinámica en la vista de detalles.

#### Scenario: Visualización de horarios en detalles del curso
- **WHEN** un usuario selecciona una asignatura para ver sus detalles
- **THEN** el sistema DEBE realizar una petición al backend para obtener los horarios de esa asignatura y mostrarlos en la sección de "Horarios" de la pestaña de información.

### Requirement: API de horarios por curso
El backend DEBE exponer un endpoint que reciba un ID de curso y devuelva una lista de todas las sesiones de horario asociadas a ese curso.

#### Scenario: Petición de horarios de un curso existente
- **WHEN** se realiza una petición GET a `/api/courses/:courseId/schedule` con un ID válido
- **THEN** el sistema DEBE devolver un array JSON con las sesiones de horario que tengan ese `courseId`.
