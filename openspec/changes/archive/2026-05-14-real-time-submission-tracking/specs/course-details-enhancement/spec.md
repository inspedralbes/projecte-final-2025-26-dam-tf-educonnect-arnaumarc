## ADDED Requirements

### Requirement: Activity Tracking View for Teachers
El sistema DEBE proporcionar a los profesores una vista de seguimiento detallada para cada actividad (recurso de tipo tarea o evento de agenda), accesible desde la lista de recursos.

#### Scenario: Opening tracking view
- **WHEN** un profesor pulsa el botón de "Seguimiento" en una tarea específica
- **THEN** el sistema abre un panel que lista a todos los alumnos matriculados divididos en las categorías de "Pendiente", "Fuera de Plazo" y "Completado".

### Requirement: Bulk Reminder Notifications
El sistema DEBE permitir a los profesores enviar una notificación de recordatorio a todos los alumnos que aún no han realizado la entrega de una actividad específica con un solo clic.

#### Scenario: Sending reminders
- **WHEN** el profesor pulsa el botón "Recordar a todos" en el panel de seguimiento
- **THEN** el sistema envía automáticamente un aviso a todos los alumnos que figuran en la lista de "Pendiente" para esa actividad.
