## Purpose
Proporcionar métricas reales y dinámicas sobre la actividad y progreso del usuario para su visualización en el perfil y otros módulos analíticos.

## Requirements

### Requirement: Get real user submission count
El sistema DEBE ser capaz de contar el número total de entregas realizadas por un alumno específico en todas sus asignaturas.

#### Scenario: User views profile with submissions
- **WHEN** un alumno con 5 entregas registradas carga su perfil
- **THEN** el sistema muestra "5" en el campo de "Entregas Realizadas".

### Requirement: Get user activity count
El sistema DEBE ser capaz de cuantificar la actividad del usuario basándose en el número de interacciones (mensajes enviados/recibidos o notificaciones).

#### Scenario: User views profile with messages
- **WHEN** un alumno tiene 12 mensajes en su historial y carga su perfil
- **THEN** el sistema muestra "12" en el campo de "Actividad" o "Mensajes".
