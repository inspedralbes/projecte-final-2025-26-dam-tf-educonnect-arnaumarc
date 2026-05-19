# Design: Fix Task Submission Visibility

## Approach
The core issue stems from frontend state initialization and missing state transitions in `CourseDetailsView.tsx`. By automatically deriving the `requiresSubmission` flag when a teacher expresses intent to create a submittable item, we will ensure it defaults correctly.

1. **Resource Creation Modal (Añadir Recurso)**
   - When the user selects "Tarea / Ejercicio", update state to `type: 'task'` AND `requiresSubmission: true`.
   - When the user selects "Material / Teoría", update state to `type: 'material'` AND `requiresSubmission: false`.

2. **Event Creation Modal (Nuevo Hito / Evento)**
   - Initial state of `newEvent` is `type: 'activity'` and `modality: 'digital'`. We will change the initial state to `requiresSubmission: true`.
   - Add logic to the `<select>` inputs for `type` and `modality`. If `(type === 'activity' || type === 'exam') && modality === 'digital'`, then `requiresSubmission` should be set to `true`, otherwise `false`.

## Component Changes
- `main/frontend/views/CourseDetailsView.tsx`:
  - `const [newEvent, setNewEvent] = useState(...)`: Update default state.
  - `setNewResource` calls inside the buttons for changing Resource type.
  - `onChange` handlers for Event `type` and `modality` `<select>` elements.

## State Management
No backend or database migrations are required because the underlying schema and API endpoints already handle `requiresSubmission` correctly. The issue is strictly isolated to default frontend state.
