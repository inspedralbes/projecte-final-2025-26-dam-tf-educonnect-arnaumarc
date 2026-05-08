## ADDED Requirements

### Requirement: Thematic Hierarchy as Root
El sistema SHALL organizar la pestaña de "Recursos & Agenda" utilizando los Temas como contenedores raíz obligatorios. No se podrá añadir contenido (recursos o eventos) fuera de un Tema.

#### Scenario: Visualizing course content
- **WHEN** un usuario accede a la pestaña de "Recursos & Agenda"
- **THEN** el sistema debe mostrar una lista de temas expandibles, donde cada uno agrupa sus propios recursos y eventos asociados.

### Requirement: Topic-Linked Events
El sistema SHALL permitir que los eventos de la agenda (exámenes, entregas, actividades) estén vinculados a un tema específico.

#### Scenario: Creating a new exam for a topic
- **WHEN** un profesor añade un evento de tipo "examen" seleccionando un tema específico
- **THEN** el evento debe aparecer visualmente dentro de la sección de "Agenda" de ese tema en la vista de detalles.

### Requirement: Exam Modality Support
El sistema SHALL permitir distinguir entre exámenes de modalidad "Papel" y "Digital" al crear o editar un evento de tipo examen.

#### Scenario: Defining exam modality
- **WHEN** el profesor configura un examen
- **THEN** el sistema debe ofrecer un selector de modalidad que se guardará en el registro del evento.

### Requirement: Physical Event Status Tracking
El sistema SHALL permitir al profesor marcar el estado de los eventos físicos (ej. exámenes en papel o entregas físicas) como "Realizado" o "Calificado".

#### Scenario: Marking a paper exam as completed
- **WHEN** un profesor marca un examen de modalidad "Papel" como "Realizado"
- **THEN** el estado debe actualizarse visualmente para todos los usuarios y quedar registrado en la base de datos.
