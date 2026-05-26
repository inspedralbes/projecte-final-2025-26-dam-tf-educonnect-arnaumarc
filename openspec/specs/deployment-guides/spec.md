## Requirements

### Requirement: Unified Deployment Manual
The system SHALL provide a single, comprehensive `INSTALL.md` file that guides the user through the setup of all project modules.

#### Scenario: New developer setup
- **WHEN** a new developer follows the `INSTALL.md` instructions
- **THEN** they are able to successfully launch the backend and frontend.

### Requirement: Automated Setup Script
The project SHALL include a root-level script (e.g., `setup.js` or `setup.sh`) that automates the `npm install` and environment check for all sub-directories, excluding decommissioned modules like the mobile application.

#### Scenario: Rapid environment preparation
- **WHEN** the user runs the setup script from the root directory
- **THEN** all dependencies for the active modules (Backend, Frontend) are installed and any missing `.env` files are reported, and the decommissioned `expo-mobile` module is ignored.
