## 1. Backend Schema and Core Updates

- [x] 1.1 Update `Submission` model (`main/backend/src/models/Submission.js`) to include `grade` (Number) and `feedback` (String).
- [x] 1.2 Update `Notification` model (`main/backend/src/models/Notification.js`) to include `link` (String) and add `GRADE` to the `type` enum.
- [x] 1.3 Update `notificationHelper.js` to accept and handle the `link` parameter.

## 2. API and Controller Implementation

- [x] 2.1 Create the evaluation endpoint `PUT /api/submissions/:id/grade` in `submissionRoutes.js` and implement the controller in `submissionController.js`.
- [x] 2.2 Update `topicController.js` to generate and pass deep links when notifying about new materials/tasks.
- [x] 2.3 Update `eventController.js` to generate and pass deep links when notifying about new exams/events.

## 3. Frontend Evaluation Workflow

- [x] 3.1 Enhance `SubmissionTracker.tsx` with a grading UI (inputs for grade and feedback) for teachers.
- [x] 3.2 Connect the `SubmissionTracker` grading UI to the new backend evaluation endpoint.
- [x] 3.3 Update `NotificationPanel.tsx` to support the `GRADE` notification type with appropriate icons and colors.
## 4. Deep Linking and Navigation Logic

- [x] 4.1 Update `CourseDetailsView.tsx` to detect and parse `topicId`, `resourceId`, and `eventId` from URL query parameters.
- [x] 4.2 Implement auto-expansion of topics and auto-scroll to items in `CourseDetailsView.tsx`.
- [x] 4.3 Update `NotificationPanel.tsx` to use the `link` field for the "Ir" button navigation.

## 5. Verification

- [x] 5.1 Test task creation and verify the generated notification link format.
- [x] 5.2 Test navigation from a notification and verify auto-expand/scroll behavior.
- [x] 5.3 Test the grading workflow from the teacher's perspective and verify the student receives the notification and sees the grade.
