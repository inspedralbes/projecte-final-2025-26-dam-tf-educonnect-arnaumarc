## ADDED Requirements

### Requirement: Database E/R Diagram
The system documentation SHALL include a complete Entity-Relationship diagram showing all models (Alumno, Professor, Course, Schedule, Notification, etc.) and their relations.

#### Scenario: Database schema visualization
- **WHEN** the user views the 'C Disseny' section of the documentation
- **THEN** they see an E/R diagram representing the current MongoDB schema and its logical relations.

### Requirement: System Class Diagram
The documentation SHALL include a class diagram representing the backend structure, including controllers, models, and service helpers.

#### Scenario: Backend architecture understanding
- **WHEN** the user reviews the backend design documentation
- **THEN** they see a class diagram showing the hierarchy and interaction of the system components.

### Requirement: Notification Flow Activity Diagram
The documentation SHALL include an activity diagram specifically for the real-time notification system (Socket.io + Discord).

#### Scenario: Trace notification logic
- **WHEN** the user follows the activity diagram for notifications
- **THEN** they can clearly identify the path from the sender's action to the final delivery on Web, Mobile, and Discord.

### Requirement: Screen Flow Documentation
The documentation SHALL include a diagram showing the navigation flow between the main application screens for both Alumno and Professor roles.

#### Scenario: Navigation audit
- **WHEN** the user checks the screen flow diagram
- **THEN** they can trace the user journey from Login to any functional view (Schedule, Courses, etc.).
