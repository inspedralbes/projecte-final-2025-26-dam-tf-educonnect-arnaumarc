# encoding-standardization Specification

## Purpose
Este estándar define los requisitos para la correcta codificación de caracteres en el proyecto EduConnect, asegurando que todos los textos en español sean legibles y estén libres de artefactos de codificación (mojibake).

## Requirements

### Requirement: UTF-8 Character Encoding
El sistema SHALL utilizar exclusivamente la codificación UTF-8 para todos los archivos de código fuente, archivos de configuración y datos almacenados, garantizando la correcta visualización de caracteres especiales del idioma español (tildes, eñes, aperturas de interrogación).

#### Scenario: Displaying special characters in UI
- **WHEN** un usuario accede a cualquier vista de la plataforma que contenga textos con tildes (ej. "Descripción", "Información")
- **THEN** el sistema debe renderizar estos caracteres de forma legible y sin artefactos de codificación (mojibake).

#### Scenario: API Responses with special characters
- **WHEN** el backend envía una respuesta JSON conteniendo mensajes con caracteres especiales
- **THEN** las cabeceras de respuesta deben especificar `charset=utf-8` y el contenido debe estar correctamente codificado.

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
