## ADDED Requirements

### Requirement: Unified Feed Display
El sistema SHALL mostrar en una única interfaz (Tablón) todos los avisos del curso, ya sean mensajes directos de profesores o notificaciones generadas automáticamente por el sistema.

#### Scenario: Student viewing the Tablon
- **WHEN** un estudiante accede a la vista del Tablón
- **THEN** el sistema debe mostrar una lista cronológica que integre tanto los objetos de tipo "Message" como los de tipo "Notification" pertinentes al usuario.

### Requirement: Smart Notification Grouping and Interactive Toasts
El sistema SHALL agrupar dinámicamente las notificaciones del mismo tipo, origen y ventana de tiempo para evitar el colapso visual. Además, los Toasts de notificación SHALL ser interactivos, permitiendo acciones rápidas como marcar como leído.

#### Scenario: Multiple resources added same day
- **WHEN** el usuario recibe múltiples notificaciones similares y se muestran los Toasts
- **THEN** el sistema debe mostrar entradas agrupadas (ej: "3 nuevos materiales") y permitir interactuar con el Toast directamente.

### Requirement: Auto-Archiving of Transient Alerts
El sistema SHALL ocultar automáticamente del feed principal las notificaciones de tipo informativo (materiales, temas) que tengan más de 7 días de antigüedad.

#### Scenario: Cleaning old notifications
- **WHEN** una notificación de "Nuevo Material" cumple 8 días desde su creación
- **THEN** el sistema debe dejar de mostrarla en la lista principal del Tablón, manteniéndola accesible solo en el historial completo o en el panel de notificaciones de la campana.

### Requirement: Global Socket Hub
El sistema SHALL gestionar todas las conexiones de tiempo real a través de un único `SocketContext` global, eliminando suscripciones locales en las vistas.

#### Scenario: Real-time update across views
- **WHEN** llega una nueva notificación mientras el usuario navega entre el Tablón y otra vista
- **THEN** el `SocketContext` debe capturar el evento y actualizar el estado global para que la información persista sin necesidad de recargar la página.
