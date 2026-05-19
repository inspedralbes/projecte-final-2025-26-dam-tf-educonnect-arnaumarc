## 1. Frontend: Force Submission Flag

- [x] 1.1 Update `handleAddResource` in `CourseDetailsView.tsx` to force `requiresSubmission: true` if `newResource.type === 'task'`.
- [x] 1.2 Update `handleCreateEvent` in `CourseDetailsView.tsx` to force `requiresSubmission: true` if `newEvent.type === 'activity'` or `newEvent.type === 'exam'` and `newEvent.modality === 'digital'`.

## 2. Frontend: UI Fallback for Students

- [x] 2.1 Update student view rendering in `CourseDetailsView.tsx` (Resource section) to show the submission section if `(resource.requiresSubmission || resource.type === 'task')`.
- [x] 2.2 Update student view rendering for events in `CourseDetailsView.tsx` to show the submission section if `(event.requiresSubmission || event.type === 'activity' || event.type === 'exam')`.

## 3. Backend: Whitelist Submission Fields

- [x] 3.1 Verify and ensure `addResource` and `updateResource` in `topicController.js` correctly persist `requiresSubmission` and `submissionType`.
- [x] 3.2 Verify and ensure `createEvent` and `updateEvent` in `eventController.js` correctly persist `requiresSubmission` and `submissionType`.

## 4. Verification

- [x] 4.1 Create a new task and verify the student sees the "Realizar Entrega" button without manual selection in the modal.
- [x] 4.2 Verify existing legacy tasks (with `requiresSubmission: false` in database) now show the "Realizar Entrega" button to students.
