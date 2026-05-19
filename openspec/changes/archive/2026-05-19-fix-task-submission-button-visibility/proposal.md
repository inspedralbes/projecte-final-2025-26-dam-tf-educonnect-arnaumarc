## Why

Students are unable to see the "Realizar Entrega" button for tasks (type: 'task') because the `requiresSubmission` field often defaults to or is saved as `false`. This occurs due to inconsistencies in state management during resource creation and backend handling. This change is critical to ensure students can submit their assignments.

## What Changes

- **Frontend Enforcement**: In `CourseDetailsView.tsx`, the `handleAddResource` and `handleCreateEvent` functions will be updated to force `requiresSubmission: true` for any item of type `task` (or `activity`/`exam` with digital modality) before sending the request to the backend.
- **Backward Compatibility**: The frontend rendering logic for student submissions will be updated to show the "Realizar Entrega" button if a resource is of type `task`, even if `requiresSubmission` is `false` (handling legacy data).
- **Backend Integrity**: Ensure `requiresSubmission` and `submissionType` are correctly extracted and persisted in `topicController.js` and `eventController.js`.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `submission-tracking`: Ensure that any activity categorized as a "task" or "digital activity/exam" always supports and requires a submission lifecycle.
- `course-details-enhancement`: Update the resource display and creation UI to guarantee submission availability for tasks.

## Impact

- **Frontend**: `main/frontend/views/CourseDetailsView.tsx` (UI logic and API calls).
- **Backend Controllers**: `main/backend/src/controllers/topicController.js`, `main/backend/src/controllers/eventController.js`.
- **Database Models**: `main/backend/src/models/Topic.js`, `main/backend/src/models/Event.js` (validation/defaults).
