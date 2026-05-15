## Why

La integración de Meet en el Tablón genera un volumen elevado de notificaciones individuales (llamadas, mensajes de chat) que saturan la interfaz y dificultan la lectura de otros avisos importantes. Agrupar estos eventos por remitente y día mejorará significativamente la claridad visual y la experiencia de usuario.

## What Changes

- **Agrupación Inteligente de Meet**: Implementación de lógica en el Frontend para colapsar eventos de `MEET_CALL` y `MEET_MESSAGE`.
- **Criterios de Agrupación**: Los eventos se agruparán si pertenecen al mismo remitente (`sender._id`) y ocurrieron en el mismo día natural.
- **Interfaz Desplegable**: Uso de componentes colapsables con el título "Actividad reciente en Meet de [Nombre Remitente]".

## Capabilities

### New Capabilities
- `notification-grouping`: Define las reglas generales para la agrupación de eventos similares en el feed para reducir el ruido visual.

### Modified Capabilities
- `communication-centralization`: Actualización de los requisitos de visualización del feed para soportar estructuras de datos agrupadas.

## Impact

- **Frontend**: `TablonView.tsx` (función `groupFeed` y lógica de renderizado).
- **UX**: Mejora en la jerarquía de información y limpieza del Tablón Personal.
