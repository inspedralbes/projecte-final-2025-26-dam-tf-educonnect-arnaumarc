## Requirements

### Requirement: Centralized Help System
The system SHALL provide a comprehensive user manual in Markdown format accessible via the documentation directory.

#### Scenario: User manual accessibility
- **WHEN** an administrator or developer navigates to the `doc/` directory
- **THEN** they SHALL find a `MANUAL.md` file containing the structured help content.

### Requirement: Role-Based Guidance
The manual MUST provide distinct sections or clear indicators for functionalities specific to Students (Alumnes) and Teachers (Professors), focusing exclusively on the Web platform.

#### Scenario: Teacher-specific management
- **WHEN** a teacher reads the manual
- **THEN** they SHALL find a dedicated section explaining the Teacher Dashboard and schedule management tools on the web.

### Requirement: Integration Documentation
The manual SHALL document the interactions with external and cross-platform modules, including Meet, while omitting references to mobile-specific integrations.

#### Scenario: Video Meeting usage
- **WHEN** a user wants to understand how to join a meeting
- **THEN** they SHALL find a section explaining the Meet integration and interface.

### Requirement: Visual Organization
The manual SHALL be organized into logical sections (Dashboard, Schedule, Resources, etc.) and include placeholders or descriptions for future visual screenshots.

#### Scenario: Visual aid placeholders
- **WHEN** browsing the manual
- **THEN** the user SHALL encounter descriptive tags or markdown links pointing to the `doc/img/manual/` directory for illustrative purposes.
