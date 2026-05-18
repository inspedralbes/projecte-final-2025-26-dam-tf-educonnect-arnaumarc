## Context

El sistema de chat actual falla en escenarios de múltiples pestañas debido a que el servidor asocia un único socket a cada ID de usuario. Además, la lógica de la UI no diferencia correctamente los mensajes enviados de los recibidos porque las comparaciones de ID de MongoDB (ObjectId vs String) son inconsistentes en el frontend.

## Goals / Non-Goals

**Goals:**
- Asegurar que todos los mensajes lleguen a todas las instancias (pestañas) del receptor.
- Diferenciar visualmente los mensajes enviados (derecha, azul) de los recibidos (izquierda, gris).
- Normalizar las comparaciones de identidad en el frontend para que sean infalibles.

**Non-Goals:**
- Implementar notificaciones push de navegador.
- Cambiar el almacenamiento de base de datos a SQL.

## Decisions

### 1. Uso de Sockets Rooms (Salas)
En lugar de emitir a un `socketId` específico, el backend hará que cada usuario se una a una sala con su propio ID (`socket.join(userId)`).
- **Razón**: Permite enviar mensajes a `io.to(userId)`, lo que distribuye el mensaje a todos los dispositivos conectados de ese usuario.

### 2. Normalización de Identidad (`getSafeId`)
Se implementará una utilidad en el frontend para extraer el ID como string de cualquier objeto de usuario (`user._id || user.id`).
- **Razón**: Evita fallos de renderizado causados por la mezcla de tipos de datos que vienen de la API y de los sockets.

### 3. Referencias Dinámicas en el Modelo `Message`
El campo `receiver` del modelo `Message` usará `refPath: 'receiverModel'` para soportar tanto a Alumnos como a Profesores.
- **Razón**: Actualmente está fijado solo a 'Alumno', lo que causa errores de población (populate) cuando el receptor es un profesor.

## Risks / Trade-offs

- **[Riesgo]** Sobrecarga de memoria en el servidor por exceso de salas. → **Mitigación**: Socket.io gestiona las salas de forma eficiente; se limpiarán automáticamente al desconectar el último socket de un usuario.
- **[Riesgo]** Mensajes duplicados en la UI. → **Mitigación**: Implementar una comprobación de `_id` antes de añadir mensajes al estado de React.
