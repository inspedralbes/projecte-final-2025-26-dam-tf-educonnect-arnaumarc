## Context

Actualmente, el sistema gestiona Temas (recursos estáticos) y Eventos (agenda) de forma independiente. La interfaz los separa en dos bloques visuales distintos dentro de la misma pestaña. Para mejorar la cohesión académica, se propone una estructura donde el Tema sea el contenedor de ambos.

## Goals / Non-Goals

**Goals:**
- Unificar la visualización de recursos y eventos bajo una estructura temática.
- Permitir la vinculación técnica entre eventos y temas en la base de datos.
- Soportar la distinción de modalidad de exámenes (físico vs digital).
- Proporcionar herramientas al profesor para registrar el progreso de hitos físicos.

**Non-Goals:**
- Implementar un sistema de calificación completo (solo estados de hito).
- Cambiar la lógica de notificaciones de eventos (se mantiene la existente).
- Modificar el sistema de archivos (upload/storage).

## Decisions

### 1. Extensión del Modelo de Eventos
Se añadirá el campo `topicId` al modelo `Event` como referencia opcional a `Topic`.
- **Razón**: Permite mantener la compatibilidad con eventos generales del curso (sin tema) mientras habilita la vinculación temática.
- **Alternativa**: Meter los eventos dentro del array de recursos del Tema. **Descartado** porque rompería la lógica global de agenda y calendarios.

### 2. Atributos de Modalidad y Estado en Eventos
Se añadirán `modality` (`['paper', 'digital']`) y `status` (`['scheduled', 'done', 'graded']`) al modelo `Event`.
- **Razón**: Necesario para el seguimiento de exámenes físicos solicitado por el usuario.

### 3. Agrupación en el Frontend (CourseDetailsView)
El frontend realizará una agrupación lógica de los eventos recibidos de la API basándose en su `topicId`.
- **Razón**: Evita tener que reescribir profundamente la API de temas para incluir eventos "poblados", manteniendo la eficiencia de las consultas actuales.

### 4. Interfaz de Usuario: Temas como Acordeón Raíz
Cada tema será un acordeón que, al expandirse, mostrará dos sub-secciones: "Materiales" y "Hitos de Evaluación".

## Risks / Trade-offs

- **[Riesgo] Migración de datos** → Los eventos existentes no tendrán `topicId`. 
  - **Mitigación**: Los eventos sin `topicId` se mostrarán en una sección de "Eventos Generales" al principio o al final de la lista de temas.
- **[Riesgo] Complejidad en Modales** → El modal de añadir evento será más denso.
  - **Mitigación**: Agrupar campos relacionados y usar selectores claros.
