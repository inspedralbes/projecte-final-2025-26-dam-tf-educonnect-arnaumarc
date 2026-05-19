## Context

The EduConnect platform uses a `requiresSubmission` boolean field to determine if a resource or event should display a submission button to students. Currently, many tasks are created with this field set to `false` due to UI state desynchronization and lack of enforcement in the backend. This results in students seeing the "TAREA" label but no way to submit their work.

## Goals / Non-Goals

**Goals:**
- Guarantee that all resources identified as "tasks" allow submissions.
- Guarantee that all digital activities/exams allow submissions.
- Provide a robust UI fallback for existing data that lacks the `requiresSubmission` flag.

**Non-Goals:**
- Automating a database-wide migration of all legacy tasks (handled via UI fallback instead).
- Modifying the file upload or comment submission logic.

## Decisions

### 1. UI Rendering Fallback (Student View)
In `CourseDetailsView.tsx`, the condition to render the "Realizar Entrega" button will be loosened to include a check for the resource type.
- **Rationale**: This immediately fixes visibility for all historical tasks that were incorrectly saved with `requiresSubmission: false`.
- **Logic**: `(resource.requiresSubmission || resource.type === 'task')` and `(event.requiresSubmission || event.type === 'activity' || event.type === 'exam')`.

### 2. Forced State on Creation/Update
The frontend `handleAddResource` and `handleCreateEvent` functions will override the `requiresSubmission` state based on the selected type.
- **Rationale**: Eliminates the risk of user error where a teacher forgets to click a specific delivery option button.
- **Alternative considered**: Removing the button altogether and making it a checkbox. **Rejected** because the current UI uses these buttons to also select the `submissionType` (file, comment, etc.).

### 3. Backend Payload Whitelisting
The backend controllers (`topicController.js` and `eventController.js`) must be updated to explicitly destructure and save `requiresSubmission` and `submissionType`.
- **Rationale**: Prevents Mongoose from ignoring these fields if they aren't explicitly handled in the controller logic.

## Risks / Trade-offs

- **[Risk]** Data inconsistency between `type` and `requiresSubmission`. → **Mitigation**: The UI rendering fallback ensures the feature works regardless of the database value, while the forced state on creation prevents further drift.
- **[Trade-off]** Complexity in the UI rendering condition. → **Mitigation**: Small price to pay for backward compatibility without a migration script.
