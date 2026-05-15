## ADDED Requirements

### Requirement: Enhanced Resource Notification Metadata
El sistema SHALL incluir obligatoriamente el `courseId` y el `type` de recurso en los metadatos de la notificación generada al crear un nuevo recurso.

#### Scenario: Notifying new material
- **WHEN** un profesor publica un nuevo material en una asignatura
- **THEN** el sistema debe emitir una notificación que contenga en su campo `meta` el ID de la asignatura y el tipo `MATERIAL`, permitiendo así su agrupación posterior en el Tablón.
