## ADDED Requirements

### Requirement: Clean Schedule Seed
El script de inicialización (`seed.js`) SHALL eliminar todas las sesiones de horario existentes y NO crear nuevas sesiones por defecto, garantizando que el usuario inicie con un horario vacío.

#### Scenario: Running the seed
- **WHEN** el comando de seed se ejecuta
- **THEN** la colección `Schedule` debe quedar vacía.
