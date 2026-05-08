## Context

El sistema actual utiliza un modelo de recursos donde cada entrada es de un tipo único (`note`, `link`, `file`, `task`). Esto limita la capacidad del profesor para proporcionar materiales completos en una sola unidad lógica. Además, no existe un campo para fechas de entrega en las tareas.

## Goals / Non-Goals

**Goals:**
- Unificar los tipos de recursos en `Material` y `Task`.
- Permitir que ambos tipos contengan texto, links y archivos simultáneamente.
- Añadir un campo `dueDate` opcional para el tipo `Task`.
- Simplificar la interfaz de creación y visualización.

**Non-Goals:**
- Implementar un sistema de subida de archivos real (se mantendrá el uso de URLs para simular archivos por ahora).
- Cambiar la lógica de los Temas (solo su contenido).
- Implementar recordatorios automáticos de fechas límite.

## Decisions

### 1. Evolución del Esquema `Resource` (MongoDB)
Se modificará el esquema interno de recursos en `Topic.js` para que todos los campos sean opcionales y coexistentes.
- **Razón**: Máxima flexibilidad sin necesidad de crear múltiples modelos.
- **Campos**: `type` (Material/Task), `title`, `content` (descripción), `url` (archivo), `link` (enlace web), `dueDate` (solo para Task).

### 2. Consolidación de Interfaces Frontend
Se actualizará `Resource` en `types.ts` para reflejar el cambio en el backend.
- **Razón**: Mantener la paridad de tipos entre frontend y backend y facilitar el tipado en los componentes de React.

### 3. Rediseño del Modal de Creación
Se pasará de un modal con pestañas/selectores de tipo a un formulario unificado.
- **Razón**: Permite al profesor ver todas las capacidades del recurso de un vistazo. El selector de tipo solo cambiará si se muestra o no el campo de "Fecha Límite".

### 4. Visualización Multimodal en `CourseDetailsView`
La tarjeta de recurso renderizará condicionalmente cada sección (Descripción, Link, Archivo, Fecha) si el dato existe en el objeto.
- **Razón**: Permite que la tarjeta se adapte al contenido proporcionado sin dejar espacios vacíos.

## Risks / Trade-offs

- **[Riesgo] Migración de datos existentes** → Los recursos antiguos solo tienen un campo relleno.
  - **Mitigación**: El diseño multimodal es compatible hacia atrás. Un recurso antiguo que solo tenga `url` se renderizará simplemente como un recurso con archivo, sin texto ni link adicional.
- **[Riesgo] Sobrecarga visual** → Tarjetas demasiado grandes si se rellena todo.
  - **Mitigación**: Usar un diseño compacto con iconos claros y tipografía jerárquica para que la información sea escaneable.
