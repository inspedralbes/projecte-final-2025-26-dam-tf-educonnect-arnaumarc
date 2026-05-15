## Why

Los profesores actualmente están limitados por campos de descripción de texto plano o, en el caso de los eventos de la agenda, por la ausencia total de descripción. Esto dificulta la creación de materiales educativos estructurados y la comunicación clara de instrucciones para hitos importantes (exámenes, entregas). Además, existe una limitación técnica: no es posible eliminar eventos una vez creados.

## What Changes

- **Editores Enriquecidos (Rich Text):** Sustitución de los `<textarea>` de descripción por un Editor de Texto Enriquecido (Tiptap) en los modales de:
    - Recursos (Materiales/Tareas).
    - Agenda (Eventos/Exámenes).
    - Notificaciones (Anuncios a la clase).
- **Mejora del Modelo de Agenda:** Adición del campo `description` al modelo `Event` para permitir instrucciones detalladas en hitos.
- **Gestión de Ciclo de Vida:** Implementación del borrado definitivo de eventos de la agenda.
- **UX de Seguridad:** Incorporación de diálogos de confirmación ("¿Estás seguro?") antes de realizar borrados definitivos para evitar pérdida accidental de datos.

## Capabilities

### New Capabilities
- `rich-text-editor`: Integración de un componente editor modular que soporte las extensiones necesarias (tablas, colores, imágenes).
- `event-lifecycle-management`: Capacidad de eliminar hitos y eventos de la agenda de forma definitiva.

### Modified Capabilities
- `course-details-enhancement`: Los recursos y eventos del curso ahora soportarán contenido multimodal enriquecido y una gestión de borrado completa.

## Impact

- **Frontend:** `CourseDetailsView.tsx` (implementación de editores, lógica de borrado y modales de confirmación), `package.json` (dependencias de Tiptap).
- **Backend:** 
    - `Event.js` (nuevo campo `description`).
    - `eventController.js` y `eventRoutes.js` (nueva ruta DELETE).
- **Tipos:** `types.ts` para reflejar el campo `description` en eventos y el soporte de HTML en contenidos.
