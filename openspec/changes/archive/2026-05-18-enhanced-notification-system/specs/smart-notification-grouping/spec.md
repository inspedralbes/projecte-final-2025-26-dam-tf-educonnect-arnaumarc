## ADDED Requirements

### Requirement: Temporal and category grouping
El sistema SHALL agrupar notificaciones no leídas del mismo tipo y curso si ocurren dentro de una ventana de 24 horas.

#### Scenario: Multiple materials in one course
- **WHEN** un profesor sube 3 materiales seguidos al mismo curso
- **THEN** el panel de notificaciones debe mostrar una sola entrada con el título "3 nuevos materiales en [Curso]" y el contenido resumido.

### Requirement: Interactive Toasts
Los avisos emergentes (toasts) SHALL incluir un botón de acción rápida para marcar la notificación como leída sin navegar fuera de la vista actual.

#### Scenario: Fast marking as read
- **WHEN** aparece un toast de nueva notificación
- **THEN** el usuario puede pulsar un botón "Leído" directamente en el toast para limpiar el contador global.
