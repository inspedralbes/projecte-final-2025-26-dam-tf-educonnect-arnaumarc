## ADDED Requirements

### Requirement: Unified Deployment Manual
The system SHALL provide a single, comprehensive `INSTALL.md` file that guides the user through the setup of all project modules.

#### Scenario: New developer setup
- **WHEN** a new developer follows the `INSTALL.md` instructions
- **THEN** they are able to successfully launch the backend, frontend, mobile app, and discord bot.

### Requirement: Automated Setup Script
The project SHALL include a root-level script (e.g., `setup.js` or `setup.sh`) that automates the `npm install` and environment check for all sub-directories.

#### Scenario: Rapid environment preparation
- **WHEN** the user runs the setup script from the root directory
- **THEN** all dependencies for all modules are installed and any missing `.env` files are reported.

### Requirement: Docker Deployment Guide
The documentation SHALL specify how to use the existing Docker configuration for the backend and database.

#### Scenario: Containerized deployment
- **WHEN** the user runs `docker-compose up` following the guide
- **THEN** the backend and MongoDB containers start correctly and are interconnected.
