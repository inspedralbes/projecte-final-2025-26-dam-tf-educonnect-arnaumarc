## Why

Los profesores actualmente están limitados por un campo de descripción de texto plano, lo que dificulta la creación de materiales educativos estructurados y visualmente atractivos. Para ofrecer una experiencia de aprendizaje más personalizada y profesional, es necesario permitir el uso de formato enriquecido, tablas, colores e imágenes dentro de las descripciones de los recursos.

## What Changes

- Sustitución del `<textarea>` de descripción por un Editor de Texto Enriquecido (Rich Text Editor) en el modal de recursos.
- Soporte para:
    - Formato de texto: Negrita, cursiva, subrayado.
    - Estructura: Listas numeradas y con viñetas, tablas.
    - Estética: Cambio de color de texto.
    - Multimedia: Inserción de imágenes.
- Actualización de la renderización de recursos en la vista del curso para procesar y mostrar HTML de forma segura.

## Capabilities

### New Capabilities
- `rich-text-editor`: Integración de un componente editor modular que soporte las extensiones necesarias (tablas, colores, imágenes).

### Modified Capabilities
- `course-details-enhancement`: Los recursos del curso ahora soportarán contenido multimodal enriquecido en el campo de descripción.

## Impact

- **Frontend:** `CourseDetailsView.tsx` (implementación del editor y renderización de HTML), `package.json` (nuevas dependencias).
- **Backend:** `Topic.js` (ajustes menores de validación si fueran necesarios para cadenas HTML largas).
- **Tipos:** `types.ts` para reflejar que el contenido puede ser HTML.
