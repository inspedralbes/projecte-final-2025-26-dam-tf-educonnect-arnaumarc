## 1. Preparación del Estado

- [x] 1.1 Añadir el estado `isSidebarOpen` en `MeetView.tsx` para controlar la visibilidad de la lista de usuarios.
- [x] 1.2 Implementar lógica para inicializar `isSidebarOpen` en `false` si el ancho de pantalla es inferior a 1024px.

## 2. Refactorización del Layout Adaptativo

- [x] 2.1 Modificar las clases de Tailwind de la barra lateral de usuarios para que sea `hidden` por defecto y `lg:flex` cuando el estado lo permita.
- [x] 2.2 Ajustar el contenedor principal del área de vídeo para que use padding dinámico (`p-2 md:p-8`).
- [x] 2.3 Implementar la transición suave del vídeo al abrir/cerrar la sidebar y el chat.

## 3. Implementación de Controles Flotantes

- [x] 3.1 Convertir la barra de controles inferior (`h-28`) en un componente posicionado de forma absoluta sobre el vídeo.
- [x] 3.2 Añadir el botón de "Participantes" (Users icon) a la barra de controles para alternar la sidebar en pantallas pequeñas.
- [x] 3.3 Aplicar estilos de desenfoque (`backdrop-blur-md`) y transparencia a la nueva barra de controles flotante.

## 4. Ajustes del Chat y UX

- [x] 4.1 Modificar `ChatPanel` (o su contenedor en `MeetView`) para que use `z-index` superior y se posicione como overlay en pantallas < 768px.
- [x] 4.2 Asegurar que los botones de control de audio/vídeo funcionen correctamente en su nueva posición flotante.
- [x] 4.3 (Opcional) Añadir lógica de auto-ocultación de controles tras 3 segundos de inactividad para una experiencia inmersiva.
