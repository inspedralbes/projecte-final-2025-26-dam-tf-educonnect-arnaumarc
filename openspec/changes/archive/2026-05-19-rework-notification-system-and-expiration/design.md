## Context

El sistema de notificaciones actual se basa en un esquema de MongoDB (`Notification.js`) que almacena avisos persistentes. Aunque existe una lógica de agrupación para mejorar la visualización, no hay mecanismos para purgar datos antiguos o innecesarios. Las notificaciones de Meet saturan el historial rápidamente.

## Goals / Non-Goals

**Goals:**
- Permitir a los usuarios el borrado físico de notificaciones.
- Automatizar la limpieza de notificaciones de Meet tras 24 horas.
- Vincular notificaciones académicas con sus recursos (`sourceId`) para permitir borrados sincronizados.
- Mejorar la experiencia de usuario en el panel y el historial con acciones de borrado.

**Non-Goals:**
- Implementar un centro de preferencias de notificaciones complejo.
- Modificar el sistema de entrega en tiempo real por WebSockets.
- Migrar datos históricos existentes (se aplicará a partir de la implementación).

## Decisions

### 1. Borrado Físico vs. Lógico
Se ha optado por el **borrado físico** (`findByIdAndDelete`) en lugar de usar un flag `deleted: true`. 
- **Razón**: Mantener la colección de MongoDB ligera y mejorar el rendimiento de la función `getUserNotifications`, que realiza agrupaciones en memoria.

### 2. Mecanismo de Limpieza Automática (Meet)
Se implementará una tarea programada en el servidor (`backend/src/index.js`) utilizando `setInterval` (o un cron si se prefiere mayor precisión) que se ejecute cada hora.
- **Razón**: Es más flexible que los índices TTL de MongoDB, permitiendo filtrar por `type` (`MEET_CALL`, `MEET_MESSAGE`) de forma sencilla.
- **Alternativa considerada**: Índices TTL parciales en MongoDB. Se descartó por la complejidad de configuración comparada con una función simple de Mongoose.

### 3. Esquema: Campo `sourceId`
Se añadirá `sourceId: { type: mongoose.Schema.Types.ObjectId }` al modelo de `Notification`.
- **Razón**: Permite que cuando un profesor borre un tema o recurso en `topicController.js`, se ejecute un `Notification.deleteMany({ sourceId: resourceId })`.

### 4. Actualización de UI en Tiempo Real
Cuando se elimine una notificación a través de la API, el frontend actualizará su estado local en `SocketContext`.
- **Razón**: Evita la necesidad de recargar la página y mantiene la interfaz fluida.

## Risks / Trade-offs

- **[Riesgo]** El borrado de notificaciones académicas sincronizado puede fallar si no se captura correctamente el evento de borrado en todos los controladores. → **Mitigación**: Centralizar la lógica de notificación en un helper robusto.
- **[Riesgo]** Sobrecarga del servidor si la tarea de limpieza es muy frecuente. → **Mitigación**: Ejecutar la limpieza una vez por hora es suficiente para la precisión requerida (24h).
- **[Trade-off]** Al borrar físicamente, se pierde la posibilidad de recuperar notificaciones borradas por error. → **Mitigación**: Añadir un diálogo de confirmación en el historial para el borrado masivo.
