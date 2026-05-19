## Context

The current system supports notifications for new content (tasks, materials, exams) and allows students to submit work. However, these notifications are not interactive, and there is no mechanism for teachers to provide feedback or grades directly through the platform.

## Goals / Non-Goals

**Goals:**
- Enable students to click on notifications to navigate directly to the specific task or event.
- Provide teachers with an integrated UI to grade and give feedback on student submissions.
- Automatically notify students when their work has been evaluated.
- Ensure the grading process is reflected in real-time if the student is online.

**Non-Goals:**
- Implementation of complex grading rubrics or weighted categories.
- Automatic grading logic (everything is manual by the teacher).
- Notifications to third parties (e.g., parents).

## Decisions

### 1. Data Model Updates
- **Submission Model**: Add `grade` (Number, 0-10) and `feedback` (String) fields.
- **Notification Model**: Add a `link` (String) field to store the target URL for deep linking. Add `GRADE` to the `type` enum.

### 2. Deep Linking Strategy
- We will use query parameters to specify the target resource. Example: `/asignaturas?courseId=123&topicId=456&resourceId=789`.
- The `CourseDetailsView` will be updated to check these parameters on load/update, expand the corresponding topic, and scroll the element into view.

### 3. Grading API
- A new endpoint `PUT /api/submissions/:id/grade` will be implemented.
- This endpoint will:
    1. Update the `Submission` document.
    2. Create a persistent `Notification` of type `GRADE` for the student.
    3. Emit a real-time `new_notification` event via Socket.io.
    4. Emit a `submission_evaluated` event via Socket.io to update the student's view if they are currently looking at the task.

### 4. UI Enhancements
- **SubmissionTracker**: Add an "Evaluate" button for each submitted entry that opens a small form (input for grade and textarea for feedback).
- **NotificationPanel**: Add specific styling and icon (e.g., a green award/check) for `GRADE` notifications.
- **CourseDetailsView**: Implement the "auto-scroll and expand" logic based on URL parameters.

## Risks / Trade-offs

- **[Risk]** Deep links becoming invalid if a topic or resource is moved.
- **[Mitigation]** Use robust IDs and ensures that notification links are generated correctly at the time of creation.

- **[Risk]** Socket.io overhead with many real-time evaluation updates.
- **[Mitigation]** Target socket emissions specifically to the recipient student's room/socket ID.
