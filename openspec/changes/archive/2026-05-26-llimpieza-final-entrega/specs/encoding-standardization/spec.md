## ADDED Requirements

### Requirement: Mojibake Prevention and Remediation
The project SHALL be scanned and cleaned of all existing encoding artifacts (mojibake) in documentation and source files to ensure professional presentation.

#### Scenario: Documentation audit
- **WHEN** the user opens `MANUAL.md` or `PLANIFICACIO.md`
- **THEN** all characters such as 'á', 'é', 'í', 'ó', 'ú', 'ñ' are displayed correctly without corruption.

### Requirement: Removal of Debug Artifacts
The system SHALL not include temporary or debug data files like `topics_debug.json` in the final delivery structure.

#### Scenario: Clean repository check
- **WHEN** performing a clean install or build
- **THEN** no `topics_debug.json` files are present in the root or module directories.
