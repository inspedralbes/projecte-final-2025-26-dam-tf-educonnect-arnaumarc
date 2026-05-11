## Why

La sección de "Recursos & Agenda" actual presenta los materiales y los eventos (exámenes, entregas) de forma separada, lo que dificulta a los alumnos y profesores ver la relación directa entre el contenido teórico/práctico y sus hitos de evaluación. Se necesita una organización temática donde el "Tema" sea el contenedor raíz que agrupe recursos y eventos para mejorar la claridad y el seguimiento del progreso académico.

## What Changes

- **Organización Centrada en Temas**: Reestructuración de la interfaz para que los temas sean los contenedores principales.
- **Vinculación de Eventos a Temas**: Posibilidad de asignar exámenes, tareas y actividades directamente a un tema específico.
- **Gestión de Modalidad de Exámenes**: Soporte para distinguir entre exámenes en papel y digitales dentro de la agenda del tema.
- **Registro de Estado de Evaluación**: Funcionalidad para que el profesor marque el estado de hitos físicos (ej. "Realizado" o "Calificado") para mantener un registro centralizado.

## Capabilities

### New Capabilities
- `thematic-content-organization`: Define la estructura jerárquica donde los temas contienen tanto recursos (teoría, ejercicios) como eventos (exámenes, entregas).

### Modified Capabilities
- `course-details-enhancement`: Actualización de los requisitos de la pestaña "Recursos & Agenda" para reflejar la nueva estructura temática.

## Impact

- **Backend**: Modificación de los modelos `Topic` y `Event` para permitir la relación opcional (topicId en Event). Actualización de controladores de temas y eventos.
- **Frontend**: Rediseño de `CourseDetailsView.tsx` (pestaña 'resources') para renderizar eventos dentro de cada tema. Actualización de modales de creación de eventos para incluir selección de tema.
- **API**: Nuevos endpoints o parámetros para filtrar eventos por tema y actualizar modalidades/estados.
