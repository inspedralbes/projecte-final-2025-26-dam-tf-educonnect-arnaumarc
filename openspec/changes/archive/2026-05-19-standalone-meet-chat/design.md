## Context

La implementación actual de Meet vincula la variable `selectedUser` directamente con el flujo de videollamada. El panel de chat se abre lateralmente consumiendo este mismo `selectedUser`. Si no hay una llamada iniciada, no hay un usuario seleccionado, lo que impide abrir el chat para consultas rápidas sin activar la cámara.

## Goals / Non-Goals

**Goals:**
- Independizar la selección del destinatario del chat de la gestión de la videollamada.
- Permitir la navegación entre diferentes chats de usuarios mientras se mantiene una llamada activa con un tercero.
- Proporcionar feedback visual en el área central cuando un usuario está seleccionado "solo para chat".

**Non-Goals:**
- Implementar chats grupales (se mantiene el modelo 1-a-1 actual).
- Modificar el esquema de base de datos de mensajes.

## Decisions

### 1. Desacoplamiento de estados en `MeetView`
Se introducirá un estado específico `activeChatUser` (o se renombrará el uso de `selectedUser` para que sea puramente de UI de selección, mientras que el estado de WebRTC usará `activeCallUser` del contexto).
- **Razón**: Permite que la UI sepa con quién estamos chateando sin interferir con quién estamos hablando por video.

### 2. Nuevo botón de acción en la lista de usuarios
Se añadirá el icono `MessageSquare` (de lucide-react) en cada fila de la lista de usuarios.
- **Comportamiento**: Al pulsarlo, se establece el usuario como objetivo del chat y se abre el panel lateral, pero NO se ejecuta `startCall`.

### 3. Vista de "Placeholder Informativo"
Si `isInCall` es falso pero hay un usuario seleccionado para chat:
- Se mostrará una versión simplificada del perfil del usuario en el área central (Avatar + Nombre + "Chateando con...").
- **Razón**: Evita que la pantalla parezca vacía o que el usuario se sienta perdido al abrir el chat.

## Risks / Trade-offs

- **[Riesgo]** Confusión de la interfaz si el usuario está hablando con A y chateando con B. → **Mitigación**: Usar etiquetas claras en el panel de chat ("Chateando con B") y en el área de video ("Llamada con A").
- **[Riesgo]** El estado de `activeChatUser` podría perderse al navegar. → **Mitigación**: Si se detecta que es necesario, se moverá el estado al `SocketContext` para que sea persistente.
