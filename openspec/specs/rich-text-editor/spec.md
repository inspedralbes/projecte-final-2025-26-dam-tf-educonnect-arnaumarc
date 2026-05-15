## Purpose
Define la integración y el comportamiento del editor de texto enriquecido (Rich Text Editor) basado en Tiptap para proporcionar una experiencia de edición multimodal y estructurada en Recursos, Agenda y Notificaciones.

## Requirements

### Requirement: Modular Rich Text Integration
El sistema SHALL integrar un editor de texto enriquecido modular (Tiptap) que sustituya los campos de texto plano (`<textarea>`) en los modales clave.

#### Scenario: Using the editor in Resources
- **WHEN** un profesor edita la descripción de un material o tarea
- **THEN** el sistema debe presentar una interfaz de edición rica que permita formato de texto, listas y tablas.

### Requirement: Support for Extended Extensions
El editor SHALL soportar extensiones para funcionalidades avanzadas como tablas, colores de texto e imágenes integradas.

#### Scenario: Creating a table in an announcement
- **WHEN** un profesor redacta una notificación y utiliza la herramienta de tabla
- **THEN** el contenido debe renderizarse correctamente conservando la estructura de celdas en la vista del receptor.

### Requirement: Consistent Visual Rendering
El contenido generado por el editor SHALL renderizarse de forma coherente y segura en todas las vistas, aplicando estilos CSS globales que respeten el diseño del proyecto (modo claro/oscuro).

#### Scenario: Viewing rich content in a card
- **WHEN** un usuario visualiza un recurso con descripción enriquecida
- **THEN** el sistema debe aplicar la clase CSS `.rich-content-view` para asegurar que las listas y tablas no rompan el layout y sean legibles en el tema visual activo.

### Requirement: Backend Storage of Rich Content
El sistema SHALL almacenar el contenido del editor como cadenas HTML o JSON estructurado en la base de datos, asegurando que se conserve el formato entre sesiones.

#### Scenario: Saving a rich description for an event
- **WHEN** un profesor añade una descripción formateada a un examen en la agenda
- **THEN** el backend debe persistir el campo `description` en el modelo `Event` y devolver el contenido exacto al recargar la página.
