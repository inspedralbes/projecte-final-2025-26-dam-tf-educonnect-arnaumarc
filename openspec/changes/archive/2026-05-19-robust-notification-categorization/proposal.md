## Why

La gestión actual de notificaciones en el Tablón es imprecisa, mezclando avisos institucionales con comunicaciones personales y de clase sin una distinción clara de origen. Además, carece de integración con eventos críticos de Meet (llamadas y chat persistente), lo que fragmenta la comunicación en tiempo real.

## What Changes

- **Clasificación por Intención**: Refactorización del feed para separar estrictamente notificaciones en Personal, Clase y General.
- **Integración de Meet**: Soporte para notificaciones de llamadas y mensajes de chat de Meet persistentes en el Tablón Personal.
- **Jerarquía de Avisos**: Distinción visual y lógica entre avisos directos del profesor y notificaciones institucionales de la escuela.
- **Nuevos Tipos de Notificación**: Implementación de `MEET_CALL`, `MEET_MESSAGE` y `PROFESSOR_ADVISORY` en el Backend y Frontend.

## Capabilities

### New Capabilities
- `professor-advisory`: Gestión de avisos directos y prioritarios del profesor a alumnos específicos, independientes de un curso.

### Modified Capabilities
- `communication-centralization`: Actualización de los requisitos de centralización para incluir la persistencia de eventos de Meet.
- `unified-resource-management`: Ajuste en la visualización de recursos (avisos) para soportar la nueva jerarquía de filtrado por pestañas.

## Impact

- **Backend**: Modelo `Notification.js` y `notificationController.js`.
- **Frontend**: `TablonView.tsx`, `SocketContext.tsx` y `NotificationPanel.tsx`.
- **API**: Nuevos endpoints para el envío de avisos directos por parte de los profesores.
