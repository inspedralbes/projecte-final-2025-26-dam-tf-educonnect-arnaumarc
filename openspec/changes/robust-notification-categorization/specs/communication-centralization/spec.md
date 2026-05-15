## MODIFIED Requirements

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
