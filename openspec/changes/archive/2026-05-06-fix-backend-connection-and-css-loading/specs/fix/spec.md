## ADDED Requirements

### Requirement: Backend connectivity
The frontend SHALL be able to connect to the backend API when running in the unified Docker environment.

#### Scenario: Connecting to API in dev environment
- **WHEN** the frontend is running on the host machine and the backend is running in Docker with port mapping 3006:3005.
- **THEN** the frontend SHALL use port 3006 for API requests.

### Requirement: Clean console
The application SHALL not produce errors related to missing assets.

#### Scenario: Loading the application
- **WHEN** the user opens the application in the browser.
- **THEN** there SHALL be no 404 errors for `index.css`.
