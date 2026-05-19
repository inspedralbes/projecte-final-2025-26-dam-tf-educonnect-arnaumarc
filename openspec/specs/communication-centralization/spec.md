## Requirements

### Requirement: Unified Feed Display
El sistema SHALL mostrar en una única interfaz (Tablón) todos los avisos del curso, comunicaciones personales y eventos de Meet, clasificándolos en las pestañas "Personal", "Clase" y "General" según su origen e intención.

#### Scenario: Student viewing the Tablon
- **WHEN** un estudiante accede a la vista del Tablón
- **THEN** el sistema debe filtrar los elementos en:
  - **Personal**: Mensajes 1:1, avisos directos del profesor y eventos de Meet.
  - **Clase**: Notificaciones de cursos inscritos y mensajes de grupo.
  - **General**: Avisos institucionales y del sistema sin curso asociado.

### Requirement: Meet Event Persistence
El sistema SHALL capturar eventos de Meet (llamadas iniciadas/perdidas y mensajes de chat) y persistirlos como notificaciones en el Tablón Personal para su consulta asíncrona.

#### Scenario: Missed call or Meet message
- **WHEN** un usuario recibe una llamada de Meet que no responde o un mensaje en el chat de una sesión activa
- **THEN** el sistema debe generar una notificación de tipo `MEET_CALL` o `MEET_MESSAGE` que aparezca en la pestaña "Personal" del Tablón.

### Requirement: Smart Notification Grouping
El sistema SHALL agrupar automáticamente las notificaciones similares para evitar el colapso visual. 
- Para **Avisos de Clase**: Agrupar por tipo y asignatura en una ventana de 48 horas.
- Para **Eventos de Meet**: Agrupar por remitente y día natural en la pestaña Personal.

#### Scenario: Multiple Meet events same day
- **WHEN** un profesor inicia 2 llamadas y envía 3 mensajes de Meet el mismo día
- **THEN** el sistema debe mostrar en el Tablón una única entrada agrupada que diga "Actividad reciente en Meet de [Nombre Profesor]".

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
