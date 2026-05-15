## MODIFIED Requirements

### Requirement: Enhanced Resource Notification Metadata
El sistema SHALL incluir obligatoriamente el `courseId`, el `type` y el `senderModel` en los metadatos de la notificación generada al crear un nuevo recurso o aviso.

#### Scenario: Notifying new material vs institutional notice
- **WHEN** se genera una notificación
- **THEN** el sistema debe poblar el campo `senderModel` con 'Professor' para avisos académicos o 'System'/'Admin' para institucionales, permitiendo al Tablón distinguir entre "Avisos de Clase" y "Avisos de la Escuela".
