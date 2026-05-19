## 1. Refactorización de Estados en MeetView

- [x] 1.1 Renombrar internamente o ajustar la lógica de `selectedUser` en `main/frontend/views/MeetView.tsx` para que actúe como el destinatario del chat independientemente de la llamada.
- [x] 1.2 Asegurar que el componente `ChatPanel` recibe siempre el usuario correcto a través de la prop `targetUser`.
- [x] 1.3 Verificar que el cierre del chat no limpie accidentalmente el estado si el usuario sigue en llamada (o viceversa).

## 2. Actualización de la Interfaz de Usuario (Lista de Usuarios)

- [x] 2.1 Añadir el icono `MessageSquare` de `lucide-react` en la lista de usuarios de `MeetView.tsx`.
- [x] 2.2 Implementar la función `startChat(user)` que establezca al usuario como seleccionado y ponga `isChatOpen` a `true` sin invocar `navigator.mediaDevices`.
- [x] 2.3 Ajustar el componente de la lista para mostrar un estado "seleccionado" (background blue) tanto si estamos en chat como en llamada con ese usuario.

## 3. Mejora del Área Central (Placeholder)

- [x] 3.1 Modificar el bloque de renderizado del área central para detectar cuando `!isInCall && selectedUser`.
- [x] 3.2 Crear una interfaz amigable (Avatar grande + Nombre + Estado) que indique que se está chateando con ese usuario en lugar de mostrar la pantalla de bienvenida genérica.

## 4. Validación y Pruebas

- [x] 4.1 Confirmar que al pulsar el botón de chat NO se solicita permiso de cámara/micro.
- [x] 4.2 Validar que se pueden intercambiar mensajes correctamente con el usuario seleccionado.
- [x] 4.3 Verificar la persistencia: cambiar de chat mientras se mantiene una llamada de video activa y volver a la conversación original.
