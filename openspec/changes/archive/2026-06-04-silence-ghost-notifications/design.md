## Context

Actualmente, el backend en `index.js` realiza una consulta a la base de datos para buscar notificaciones no leídas cada vez que un usuario se registra en el socket. Estas notificaciones se envían mediante el evento `sync_notifications`. Sin embargo, el frontend ya realiza una carga inicial de notificaciones mediante una petición HTTP GET a `/api/notifications/:userId` al montar el componente `App` o cargar la vista. Esta redundancia provoca que las notificaciones se procesen dos veces, apareciendo como "nuevas" en el feed del frontend debido a la recepción por Socket.

## Goals / Non-Goals

**Goals:**
- Eliminar la redundancia en la entrega de notificaciones iniciales.
- Prevenir la aparición de notificaciones "fantasma" (antiguas que aparecen como nuevas) al recargar.
- Simplificar el flujo de inicialización del socket.

**Non-Goals:**
- Cambiar la persistencia de las notificaciones en la base de datos.
- Modificar el endpoint de la API REST de notificaciones.

## Decisions

- **Eliminar Sincronización por Socket**: Se eliminará el bloque de código en `index.js` que emite `sync_user_notifications` (o `sync_notifications`) durante el evento `register_user`.
- **Confianza en REST**: El frontend seguirá usando la API REST para el historial. El Socket se reservará exclusivamente para notificaciones en tiempo real (eventos `new_notification`).
- **Limpieza de Frontend**: Se eliminará el listener de `sync_notifications` en `SocketContext.tsx` ya que quedará huérfano de emisor.

## Risks / Trade-offs

- **[Riesgo] Notificaciones perdidas durante la carga**: Existe una ventana de milisegundos entre que la API REST termina de cargar y el Socket se conecta.
- **[Mitigación]**: El frontend se conecta al socket inmediatamente al cargar. Si un evento ocurre justo en ese instante, el backend lo guardará en DB y la API REST lo traerá, o el socket lo emitirá si la conexión ya está establecida. El riesgo de pérdida es despreciable comparado con la molestia de los duplicados.
