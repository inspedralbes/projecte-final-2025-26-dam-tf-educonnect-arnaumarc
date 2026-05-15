## ADDED Requirements

### Requirement: Editor de texto enriquecido modular
El sistema SHALL integrar un editor de texto enriquecido que permita aplicar formato avanzado a las descripciones de los recursos.

#### Scenario: Aplicar formato básico
- **WHEN** el profesor selecciona un texto y pulsa el botón de "Negrita"
- **THEN** el texto seleccionado se muestra en negrita en el editor y se guarda como HTML `<strong>`

#### Scenario: Insertar tablas
- **WHEN** el profesor utiliza la herramienta de tablas para insertar una cuadrícula
- **THEN** se genera una estructura `<table>` en la descripción que permite introducir datos organizados

#### Scenario: Cambio de color de texto
- **WHEN** el profesor selecciona un texto y elige un color de la paleta
- **THEN** el sistema aplica un estilo de color al texto seleccionado mediante una etiqueta `<span>` con estilo inline o clase.

#### Scenario: Inserción de imágenes
- **WHEN** el profesor introduce una URL de imagen o carga un archivo
- **THEN** la imagen se muestra dentro del editor y se guarda como una etiqueta `<img>` en el contenido.

### Requirement: Renderización segura de HTML
El sistema SHALL renderizar el contenido HTML guardado en las tarjetas de recursos respetando el formato original.

#### Scenario: Visualización de tablas con scroll
- **WHEN** una tabla es más ancha que el contenedor de la tarjeta
- **THEN** el sistema debe permitir el desplazamiento horizontal (scroll) sin romper el diseño de la tarjeta.
