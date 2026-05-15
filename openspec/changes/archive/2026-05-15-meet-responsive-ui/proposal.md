## Why

La interfaz actual de Meet es rígida y no se adapta bien a diferentes tamaños de pantalla. Esto obliga a los alumnos con pantallas pequeñas (laptops de 13" o tablets) a reducir el zoom del navegador manualmente para poder acceder a los controles esenciales (micro, cámara, colgar, chat). Esta falta de adaptabilidad degrada la experiencia de usuario y dificulta la interacción durante las videollamadas.

## What Changes

- **Layout Adaptativo**: La disposición de los elementos (lista de usuarios, vídeo, chat) cambiará dinámicamente según el ancho de la pantalla.
- **Barra Lateral Colapsable**: La lista de usuarios se ocultará automáticamente en pantallas pequeñas y será accesible mediante un botón.
- **Controles Flotantes**: La barra de controles pasará de ser un elemento fijo inferior a ser un panel flotante y traslúcido sobre el vídeo para maximizar el espacio vertical.
- **Chat Overlay**: En pantallas pequeñas, el chat se mostrará como una capa superior en lugar de empujar el contenido del vídeo.
- **Padding Dinámico**: Reducción de los márgenes globales en dispositivos móviles y portátiles pequeños.

## Capabilities

### New Capabilities
- `meet-responsive-layout`: Capacidad de la interfaz de Meet para reconfigurarse automáticamente basándose en media queries y breakpoints definidos.

### Modified Capabilities
- `meet-chat-service`: Se modifica la forma en que se presenta el chat para que funcione como un overlay en pantallas reducidas.

## Impact

- **Frontend**: Modificaciones extensas en `MeetView.tsx` y ajustes en `ChatPanel.tsx`.
- **CSS**: Introducción de nuevos breakpoints y clases de Tailwind adaptativas.
- **UX**: Mejora significativa en la usabilidad desde dispositivos portátiles.
