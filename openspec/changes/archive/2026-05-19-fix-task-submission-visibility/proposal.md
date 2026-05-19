# Fix Task Submission Visibility

## Problem
Currently, when a teacher creates a "Tarea / Ejercicio" or an "Actividad Digital" via the Course Details page, the `requiresSubmission` state is initialized to `false` by default. Unless the teacher explicitly selects a delivery option button ("Solo Completar", "Comentario", etc.), the task is saved without requiring submission. As a result, students see a "TAREA" label but no button to submit the assignment, since the "Realizar Entrega" button is conditionally rendered only if `requiresSubmission` is true.

## Proposed Solution
Update the initial states and `<select>` interactions in `CourseDetailsView.tsx` to ensure that Tasks and Digital Activities/Exams automatically default to `requiresSubmission: true`. This ensures students always see the submission button for created tasks and prevents teachers from accidentally creating un-submittable tasks.

## User Review Required
N/A

## Open Questions
Should we add a visual toggle for the teacher to explicitly set "No delivery required" for tasks, or is defaulting to `requiresSubmission: true` sufficient for now?
