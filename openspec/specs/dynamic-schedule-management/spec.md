## ADDED Requirements

### Requirement: Weekly Hour Purse
El sistema SHALL permitir definir una bolsa de entre 4 y 6 horas semanales para cada asignatura.

#### Scenario: Defining weekly hours
- **WHEN** un profesor configura una asignatura
- **THEN** el sistema debe permitir establecer el total de horas semanales entre 4 y 6

### Requirement: Session Duration Constraint
El sistema SHALL permitir únicamente sesiones de clase con una duración de exactamente 1 hora o exactamente 2 horas.

#### Scenario: Adding valid sessions
- **WHEN** un profesor intenta añadir una sesión de 1 hora o 2 horas
- **THEN** el sistema debe permitir la creación de la sesión si hay horas disponibles en la bolsa

#### Scenario: Adding invalid sessions
- **WHEN** un profesor intenta añadir una sesión de 30 minutos o 1.5 horas
- **THEN** el sistema debe rechazar la operación indicando que solo se permiten sesiones de 1 o 2 horas

### Requirement: Time Block Validation
El sistema SHALL impedir la programación de clases durante el patio (11:00-11:30) y el descanso de comida (15:30-17:00).

#### Scenario: Attempting to schedule during patio
- **WHEN** un profesor intenta colocar una clase que colisione con el rango 11:00-11:30
- **THEN** el sistema debe rechazar la operación

#### Scenario: Attempting to schedule during food break
- **WHEN** un profesor intenta colocar una clase que colisione con el rango 15:30-17:00
- **THEN** el sistema debe rechazar la operación

### Requirement: Single Classroom Management
El sistema SHALL gestionar exclusivamente una única aula ("Aula Única"), eliminando cualquier selector o gestión de múltiples espacios en la interfaz de usuario y asegurando que no existan solapamientos horarios en dicho espacio.

#### Scenario: Single Classroom Assignment and Overlap Prevention
- **WHEN** se crea una sesión de horario
- **THEN** el sistema debe asignar automáticamente el valor "Aula Única" al campo classroom sin intervención del usuario e impedir solapamientos con otras sesiones en el mismo horario.

### Requirement: Session Visual Grid Span
El sistema SHALL representar visualmente el horario en bloques de 1 hora, donde cada celda del grid representa el intervalo desde el inicio de la hora hasta el inicio de la siguiente (ej. 08:00 - 09:00).

#### Scenario: Grid interval representation
- **WHEN** se renderiza el ScheduleEditor
- **THEN** las etiquetas de tiempo deben mostrarse en incrementos de 1 hora (8:00, 9:00, 10:00, etc.)

### Requirement: Course Filtering Resilience
El sistema SHALL filtrar las asignaturas del profesor comparando los IDs de forma robusta, asegurando que los tipos de datos (ObjectId vs String) no impidan el filtrado correcto.

#### Scenario: Loading courses for logged-in professor
- **WHEN** un profesor con ID "123" carga su dashboard
- **THEN** el sistema debe mostrar solo los cursos donde el campo `professor` coincida con "123" tras normalizar ambos a strings.

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

### Requirement: Operation Feedback
El sistema SHALL proporcionar feedback visual inmediato (ej. notificaciones toast) al usuario tras cada operación de añadir o borrar una sesión de horario, indicando éxito o el motivo del fallo.

#### Scenario: Deleting a session with feedback
- **WHEN** un profesor borra una sesión de clase
- **THEN** el sistema debe mostrar una notificación confirmando la eliminación.

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
