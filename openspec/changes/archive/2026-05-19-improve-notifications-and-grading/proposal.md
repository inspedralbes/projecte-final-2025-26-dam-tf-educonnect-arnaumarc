## Why

Students currently receive notifications when new tasks or events are created, but they lack a direct way to navigate to them, leading to friction in the user experience. Furthermore, while students can submit work, teachers have no integrated way to provide grades or feedback, and students are not notified when their work is evaluated. This change aims to close the feedback loop and improve navigation efficiency.

## What Changes

- **Deep Linking**: Notifications will now include a `link` field that points to the specific resource or event.
- **Frontend Navigation**: The frontend will interpret these links to navigate the student directly to the relevant content (e.g., the specific task in the Course Details view).
- **Grading System**: The `Submission` model will be updated to include `grade` and `feedback` fields.
- **Teacher Evaluation UI**: The `SubmissionTracker` component will be enhanced to allow teachers to enter grades and feedback for each student.
- **Evaluation Notifications**: A new notification type `GRADE` will be introduced. When a teacher evaluates a submission, a notification will be sent to the student.
- **Backend API**: New endpoints will be created to handle the evaluation of submissions.

## Capabilities

### New Capabilities
- `grading-system`: Capability for teachers to evaluate student submissions with grades and feedback, completing the academic lifecycle.

### Modified Capabilities
- `notification-persistence`: Update to support deep links and the new `GRADE` notification type.
- `submission-management`: Update to include grading and feedback requirements for student work.

## Impact

- **Backend**: Update to `Notification` and `Submission` models, new routes for grading, and helper updates for sending specific notifications.
- **Frontend**: Navigation logic updates, enhancements to `SubmissionTracker`, and UI updates for evaluation notifications in the `NotificationPanel`.
- **Database**: Schema migration for `Submission` and `Notification` collections.
