# Notification Deletion Specification

## Requirements

### Requirement: Individual Notification Deletion
El sistema SHALL permitir a los usuarios eliminar de forma permanente notificaciones individuales de su feed e historial.

#### Scenario: User deletes a notification from panel
- **WHEN** un usuario hace clic en el botón de eliminar (papelera) de una notificación en el panel desplegable
- **THEN** la notificación se elimina físicamente de la base de datos y desaparece de la vista del usuario en tiempo real.

### Requirement: Bulk Notification Cleanup
El sistema SHALL proporcionar una opción para que los usuarios eliminen todas sus notificaciones leídas de una sola vez.

#### Scenario: User clears read history
- **WHEN** un usuario selecciona la opción "Limpiar historial de leídos" en la vista de Historial de Actividad
- **THEN** el sistema elimina permanentemente todas las notificaciones marcadas como leídas del usuario de la base de datos.
