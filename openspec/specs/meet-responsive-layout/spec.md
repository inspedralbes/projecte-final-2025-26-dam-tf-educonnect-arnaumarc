## ADDED Requirements

### Requirement: Automatic Sidebar Hiding
El sistema SHALL ocultar la barra lateral de usuarios por defecto cuando el ancho de la pantalla sea inferior a 1024px (breakpoint `lg` de Tailwind).

#### Scenario: User opens Meet on a small laptop
- **WHEN** el usuario accede a la vista de Meet con una pantalla de 800px de ancho
- **THEN** el sistema debe ocultar la lista de usuarios automáticamente para priorizar el área de vídeo.

### Requirement: Floating Call Controls
El sistema SHALL mostrar los controles de la llamada (micrófono, cámara, finalizar, chat) como un panel flotante sobre el vídeo en lugar de una barra inferior fija.

#### Scenario: Maximizing vertical space
- **WHEN** el usuario está en una videollamada
- **THEN** el sistema debe renderizar los controles en la parte inferior central del vídeo con un fondo traslúcido, permitiendo que el stream ocupe toda la altura del contenedor.

### Requirement: Toggleable UI Components
El sistema SHALL permitir al usuario mostrar u ocultar manualmente la barra lateral de usuarios y el panel de chat mediante botones dedicados en la barra de controles.

#### Scenario: User wants to call another person on a small screen
- **WHEN** la sidebar está oculta y el usuario pulsa el botón "Participantes"
- **THEN** el sistema debe desplegar la lista de usuarios.

### Requirement: Responsive Padding
El sistema SHALL reducir los márgenes internos (padding) del contenedor principal de Meet en navegadores móviles para maximizar el uso del espacio.

#### Scenario: Viewing Meet on mobile web
- **WHEN** el ancho de pantalla es inferior a 640px (navegador móvil)
- **THEN** el sistema debe aplicar un padding máximo de 8px (`p-2`) alrededor del área de vídeo.
