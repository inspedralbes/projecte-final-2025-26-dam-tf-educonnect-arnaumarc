## ADDED Requirements

### Requirement: Teacher can evaluate submissions
The system SHALL allow teachers to assign a numeric grade (0-10) and textual feedback to any student submission.

#### Scenario: Successful evaluation
- **WHEN** a teacher submits a grade and feedback for a student submission
- **THEN** the system saves the grade and feedback in the database associated with that submission.

### Requirement: Grading Notifications
The system SHALL generate a notification of type `GRADE` for the student when their submission is evaluated.

#### Scenario: Student is notified of grade
- **WHEN** a teacher saves an evaluation for a submission
- **THEN** a notification is sent to the student with the title "Tarea Evaluada" and the grade obtained in the content.
