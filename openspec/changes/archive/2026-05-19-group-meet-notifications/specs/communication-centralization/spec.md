## MODIFIED Requirements

### Requirement: Smart Notification Grouping
El sistema SHALL agrupar automáticamente las notificaciones similares para evitar el colapso visual. 
- Para **Avisos de Clase**: Agrupar por tipo y asignatura en una ventana de 48 horas.
- Para **Eventos de Meet**: Agrupar por remitente y día natural en la pestaña Personal.

#### Scenario: Multiple Meet events same day
- **WHEN** un profesor inicia 2 llamadas y envía 3 mensajes de Meet el mismo día
- **THEN** el sistema debe mostrar en el Tablón una única entrada agrupada que diga "Actividad reciente en Meet de [Nombre Profesor]".
