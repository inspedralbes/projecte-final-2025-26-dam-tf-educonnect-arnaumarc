## Why

Actualmente, la vista de detalles de la asignatura muestra información técnica (ID del profesor) en lugar de humana (nombre completo) y contiene una sección de "Evaluación" con datos estáticos de ejemplo que no aportan valor real al usuario. Es necesario mejorar la calidad de la información mostrada y fomentar el sentimiento de comunidad permitiendo que los alumnos vean quiénes son sus compañeros de clase.

## What Changes

- **Visualización del Profesor**: Se sustituirá el ID/Código del profesor por su nombre y apellidos en todas las vistas de asignaturas.
- **Sección de Miembros**: Se reemplazará el bloque estático de "Evaluación" por un nuevo bloque de "Miembros de la clase".
- **Visibilidad para Alumnos**: Los alumnos ahora podrán ver la lista de sus compañeros matriculados en la misma asignatura.
- **Información del Docente**: Se añadirá una ficha con la especialidad y el correo electrónico del profesor.
- **Carga Académica**: Se mostrarán las horas semanales totales de la asignatura.
- **Población de Datos en Backend**: Se actualizarán los controladores de autenticación y usuario para incluir los datos del profesor en las asignaturas matriculadas.

## Capabilities

### New Capabilities
- `course-details-enhancement`: Define los requisitos para mostrar información enriquecida de la asignatura, incluyendo la correcta identificación del profesor y la visibilidad de los miembros de la clase para todos los roles.

### Modified Capabilities
- `professor-centralization`: Se ajustan los requisitos para asegurar que la centralización de datos del profesor se refleje correctamente en las consultas de cursos para alumnos.

## Impact

- **Backend**: `authController.js`, `userController.js`, `courseController.js`. Se requiere añadir `.populate()` en las consultas de cursos.
- **Frontend**: `CourseDetailsView.tsx`, `AsignaturasView.tsx`. Rediseño de componentes para mostrar la nueva información.
- **API**: Cambio en la respuesta de login y perfiles de usuario para incluir objetos de profesor poblados.
