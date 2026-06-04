## Why

Actualmente existe una duplicidad en el manejo de notificaciones de llamadas: el backend las guarda en la base de datos, pero el frontend también crea una notificación local (temporal) que desaparece al refrescar. Además, la lógica de sincronización entre el estado del socket y la base de datos no es óptima, lo que provoca que los usuarios vean notificaciones duplicadas o que las llamadas perdidas no se reflejen correctamente si el frontend "fuerza" su propia versión local.

## What Changes

- **Frontend**: Eliminación de la creación de notificaciones locales (`temp-XXXX`) para llamadas en `SocketContext.tsx`.
- **Sincronización**: El frontend confiará exclusivamente en el evento `new_notification` que emite el backend (el cual ya incluye la persistencia en DB).
- **UX**: Mejora de la visualización de llamadas perdidas en el Tablón, asegurando que el rastro de la llamada (notificación de tipo `MEET_CALL`) persista de forma coherente.
- **Limpieza**: Asegurar que la lógica de limpieza de 24 horas en el backend sea robusta.

## Capabilities

### Modified Capabilities
- `notification-persistence`: Se ajustarán los requisitos para unificar el flujo y eliminar la volatilidad en el frontend.

## Impact

- **Frontend**: `SocketContext.tsx` para eliminar la creación de notificaciones locales.
- **Backend**: `index.js` (sockets) para asegurar que el evento `incoming_call` y la notificación asociada se emitan de forma atómica.
