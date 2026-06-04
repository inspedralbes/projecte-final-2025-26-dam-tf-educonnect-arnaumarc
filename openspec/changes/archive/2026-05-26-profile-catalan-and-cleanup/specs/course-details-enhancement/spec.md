## MODIFIED Requirements

### Requirement: Presentación de Estadísticas de Usuario
El perfil de usuario MUST mostrar contadores de actividad reales basados en los datos del usuario, omitiendo cualquier dependencia de datos mock o falsos.

#### Scenario: Visualización de Cursos
- **WHEN** el usuario visualiza su perfil
- **THEN** el sistema lee el número de cursos inscritos desde el objeto usuario y presenta el contador bajo la etiqueta "Cursos".

#### Scenario: Visualización de Entregas
- **WHEN** el usuario visualiza su perfil
- **THEN** el sistema lee el recuento de entregas desde las estadísticas del usuario y lo presenta bajo la etiqueta "Entregues".