## Purpose
Define la estructura y gestión multimodal de los recursos educativos dentro de las asignaturas, permitiendo una organización clara y accesible de materiales y tareas.

## Requirements

### Requirement: Multimodal Resource Structure
El sistema SHALL permitir que un recurso individual contenga simultáneamente un título, una descripción detallada, un enlace web externo y un archivo adjunto.

#### Scenario: Creating a complete material
- **WHEN** un profesor crea un recurso de tipo "Material" completando el título, la descripción, la URL y adjuntando un archivo
- **THEN** el sistema debe guardar y mostrar todos estos componentes dentro de la misma entrada del tema.

### Requirement: Simplified Resource Categories
El sistema SHALL simplificar los tipos de recursos a dos categorías principales: "Material" (para contenidos teóricos) y "Tarea" (para actividades prácticas). Para las tareas, el sistema DEBE permitir configurar el tipo de entrega requerido.

#### Scenario: Selecting resource type and submission method
- **WHEN** el profesor abre el modal para añadir un recurso y selecciona "Tarea"
- **THEN** el sistema debe permitir elegir entre "Solo marcar como completado", "Escribir comentario" o "Subir archivo".

### Requirement: Optional Task Deadlines
El sistema SHALL permitir establecer una fecha límite de entrega para los recursos de tipo "Tarea". Esta fecha debe ser opcional y servirá de base para el cálculo de puntualidad en el sistema de seguimiento.

#### Scenario: Setting a deadline for a task
- **WHEN** un profesor crea una "Tarea" y selecciona una fecha en el campo opcional "Fecha Límite"
- **THEN** el sistema debe mostrar dicha fecha en la vista del alumno y usarla para marcar entregas como "A TIEMPO" o "TARDE".

#### Scenario: Task without deadline
- **WHEN** un profesor crea una "Tarea" y deja vacío el campo de "Fecha Límite"
- **THEN** el sistema debe guardar la tarea sin restricciones de tiempo y tratar todas las entregas como "A TIEMPO".

### Requirement: Resource UI Visual Integrity
La interfaz de gestión de recursos SHALL presentar etiquetas y controles con ortografía correcta en español, eliminando cualquier error de codificación heredado en títulos de modales, etiquetas de campos y botones de acción.

#### Scenario: Viewing resource management modals
- **WHEN** un profesor abre los modales de "Añadir Tema" o "Añadir Recurso"
- **THEN** todas las etiquetas de los campos (ej. "Título", "Descripción") deben mostrarse con las tildes correctas y sin caracteres extraños.

### Requirement: Enhanced Resource Notification Metadata
El sistema SHALL incluir obligatoriamente el `courseId`, el `type` y el `senderModel` en los metadatos de la notificación generada al crear un nuevo recurso o aviso.

#### Scenario: Notifying new material vs institutional notice
- **WHEN** se genera una notificación
- **THEN** el sistema debe poblar el campo `senderModel` con 'Professor' para avisos académicos o 'System'/'Admin' para institucionales, permitiendo al Tablón distinguir entre "Avisos de Clase" y "Avisos de la Escuela".
