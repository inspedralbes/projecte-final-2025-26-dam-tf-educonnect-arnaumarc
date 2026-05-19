## MODIFIED Requirements

### Requirement: Resource Reference in Notifications
El esquema de notificaciones SHALL incluir un campo opcional `sourceId` para vincular avisos a recursos académicos específicos (Topic, Resource, Exam) y un campo `link` para permitir la navegación directa (deep linking).

#### Scenario: Notification linking to exam
- **WHEN** se crea una notificación de tipo EXAM
- **THEN** el sistema debe almacenar el ID del examen en el campo `sourceId` para permitir futuras operaciones de borrado sincronizado y generar una URL de navegación en el campo `link`.
