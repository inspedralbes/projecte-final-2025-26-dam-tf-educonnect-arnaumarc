## ADDED Requirements

### Requirement: Professor Association
El sistema SHALL permitir que cada asignatura (`Course`) esté vinculada a un único profesor mediante una referencia de base de datos (`ObjectId`).

#### Scenario: Course creation with professor
- **WHEN** se crea una nueva asignatura en el sistema
- **THEN** el sistema debe exigir y guardar la referencia al ID del profesor responsable

### Requirement: Real-time Schedule Filtering
El sistema SHALL filtrar el horario basándose exclusivamente en los IDs de las asignaturas presentes en la base de datos MongoDB.

#### Scenario: Displaying student schedule
- **WHEN** un estudiante accede a su vista de asignaturas
- **THEN** el sistema debe mostrar únicamente las sesiones de horario cuyos `courseId` coincidan con los IDs reales de sus asignaturas matriculadas

## MODIFIED Requirements

### Requirement: Frontend Data Source
El frontend SHALL obtener toda la información de asignaturas y horarios directamente de la API, eliminando cualquier dependencia de datos estáticos locales.

#### Scenario: Loading course list
- **WHEN** el usuario navega a la sección "Mis Asignaturas"
- **THEN** el sistema realiza una petición GET a `/api/courses` y renderiza los resultados obtenidos, sin recurrir a `MOCK_COURSES` en caso de fallo o retardo.
