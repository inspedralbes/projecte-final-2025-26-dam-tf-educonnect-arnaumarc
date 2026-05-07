## MODIFIED Requirements

### Requirement: Frontend Data Source
El frontend SHALL obtener toda la información de asignaturas y horarios directamente de la API, asegurando que los objetos complejos (como el profesor) estén correctamente poblados para su visualización inmediata.

#### Scenario: Loading course list with populated data
- **WHEN** el usuario navega a la sección "Mis Asignaturas"
- **THEN** el sistema realiza una petición GET a `/api/courses` (o recibe los datos vía login/user) y renderiza los resultados con el objeto `professor` totalmente accesible (nombre y apellidos), sin necesidad de peticiones adicionales.
