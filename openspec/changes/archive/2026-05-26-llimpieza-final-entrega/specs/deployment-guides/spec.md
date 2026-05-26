## MODIFIED Requirements

### Requirement: Automated Setup Script
The project SHALL include a root-level script (e.g., `setup.js` or `setup.sh`) that automates the `npm install` and environment check for all sub-directories, excluding decommissioned modules like the mobile application.

#### Scenario: Rapid environment preparation
- **WHEN** the user runs the setup script from the root directory
- **THEN** all dependencies for the active modules (Backend, Frontend, Bot) are installed and any missing `.env` files are reported, and the decommissioned `expo-mobile` module is ignored.

## REMOVED Requirements

### Requirement: Docker Deployment Guide
**Reason**: This change focuses on cleaning up dead code and UI. While Docker is still used, the guide is being simplified to focus on the Web/Bot stack.
**Migration**: Refer to the updated `doc/D-CodiFont/INSTALL.md` which focuses on the consolidated Web + Bot architecture.
