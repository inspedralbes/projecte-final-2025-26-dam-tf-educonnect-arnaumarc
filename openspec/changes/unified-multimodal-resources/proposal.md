## Why

La estructura actual de recursos es demasiado rígida, obligando a los profesores a elegir un único tipo (archivo, enlace o nota) para cada entrada. Esto fragmenta la información y complica la gestión. Además, las tareas carecen de la posibilidad de establecer una fecha límite de entrega opcional, lo que dificulta la organización del tiempo para los alumnos.

## What Changes

- **Unificación de Recursos (Multimodalidad)**: Los recursos (Apuntes y Tareas) permitirán contener simultáneamente texto descriptivo, enlaces web y archivos adjuntos.
- **Simplificación de Tipos**: Reducción de los tipos de recursos a dos categorías principales altamente versátiles: `Material` (Apuntes/Teoría) y `Task` (Ejercicios/Tareas).
- **Fecha Límite Opcional**: Introducción de un campo de fecha de entrega opcional exclusivamente para el tipo `Task`.
- **Mejora en la Personalización**: Mayor espacio y flexibilidad para el contenido detallado en cada recurso.

## Capabilities

### New Capabilities
- `unified-resource-management`: Define el nuevo modelo multimodal donde un recurso agrupa múltiples medios (texto, links, archivos) y soporta metadatos opcionales como fechas de entrega.

### Modified Capabilities
- `thematic-content-organization`: Actualización de los requisitos de la estructura temática para integrar los nuevos recursos unificados dentro de los temas.

## Impact

- **Backend**: Modificación del esquema `topicSchema` (sub-esquema `resourceSchema`) en `Topic.js` para soportar múltiples campos (`url`, `link`, `content`, `dueDate`). Actualización de controladores para manejar estos campos.
- **Frontend**: Rediseño del modal de creación de recursos en `CourseDetailsView.tsx`. Actualización de la visualización de recursos para mostrar todos los componentes (texto, link, archivo, fecha) en una sola tarjeta.
- **Tipos**: Actualización de la interfaz `Resource` en `types.ts`.
