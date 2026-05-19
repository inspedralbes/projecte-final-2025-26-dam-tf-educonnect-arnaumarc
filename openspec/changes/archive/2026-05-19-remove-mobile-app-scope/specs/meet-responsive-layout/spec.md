## MODIFIED Requirements

### Requirement: Responsive Padding
El sistema SHALL reducir los márgenes internos (padding) del contenedor principal de Meet en navegadores móviles para maximizar el uso del espacio.

#### Scenario: Viewing Meet on mobile web
- **WHEN** el ancho de pantalla es inferior a 640px (navegador móvil)
- **THEN** el sistema debe aplicar un padding máximo de 8px (`p-2`) alrededor del área de vídeo.
