## Why

El sistema de notificaciones actual acumula avisos de forma permanente sin opción de borrado manual, lo que satura la interfaz del usuario. Además, las notificaciones de Meet (llamadas y mensajes) persisten indefinidamente a pesar de ser efímeras, y las notificaciones académicas no se sincronizan correctamente cuando el recurso original (examen o tarea) es eliminado o gestionado por el profesor.

## What Changes

- **Borrado Manual**: Implementar la capacidad para que los usuarios eliminen notificaciones individuales de su feed e historial.
- **Expiración Automática de Meet**: Configurar un sistema de limpieza que elimine automáticamente las notificaciones de `MEET_CALL` y `MEET_MESSAGE` tras 24 horas.
- **Vinculación de Recursos Académicos**: Asociar las notificaciones de exámenes, materiales y tareas con sus recursos de origen (`sourceId`) para permitir limpiezas en cascada o actualizaciones de estado.
- **Limpieza de Historial**: Añadir una función de "Limpiar todo" para vaciar el historial de notificaciones leídas.

## Capabilities

### New Capabilities
- `notification-deletion`: Permite a los usuarios eliminar físicamente notificaciones de la base de datos a través de la API y la UI.
- `notification-lifecycle-management`: Gestiona la expiración temporal y la limpieza automática de notificaciones efímeras.

### Modified Capabilities
- `notification-persistence`: Se modifica el esquema para soportar referencias a recursos (`sourceId`) y facilitar el borrado.
- `meet-chat-service`: Se actualiza el flujo de creación de notificaciones de Meet para marcar su carácter efímero.

## Impact

- **Backend**: Nuevos endpoints en `notificationRoutes.js`, lógica en `notificationController.js` y tareas programadas (cron) para limpieza.
- **Modelos**: Actualización de `Notification.js` para incluir `sourceId`.
- **Frontend**: Nuevos componentes de UI (botones de borrado) en `NotificationPanel.tsx` y `ActivityHistoryView.tsx`.
