## Context

La aplicación EduConnect muestra actualmente información incompleta sobre las asignaturas en el perfil del alumno. Los cursos se cargan con IDs de profesores en lugar de sus datos personales. Además, la interfaz de detalle de curso contiene marcadores de posición estáticos para la evaluación que deben ser reemplazados por información dinámica y útil.

## Goals / Non-Goals

**Goals:**
- Asegurar que el objeto `professor` esté disponible en el frontend tras el login y al cargar el perfil.
- Implementar una sección dinámica de "Miembros de la clase" en la vista de detalles.
- Habilitar la visualización de la lista de alumnos para usuarios con rol de estudiante.

**Non-Goals:**
- Implementar lógica real de evaluación o calificaciones en este cambio.
- Modificar el esquema de la base de datos (se usará la estructura existente con `populate`).

## Decisions

### 1. Población de datos en el servidor
- **Decisión**: Añadir `.populate({ path: 'enrolledCourses', populate: { path: 'professor' } })` en los controladores de autenticación y usuario.
- **Razón**: Es la forma más eficiente de asegurar que el frontend tenga toda la información necesaria sin realizar múltiples peticiones HTTP adicionales.
- **Alternativa**: Realizar una petición separada por cada profesor desde el frontend. Descartado por ser ineficiente (N+1 queries en el cliente).

### 2. Visibilidad Universal de la Lista de Alumnos
- **Decisión**: Modificar `CourseDetailsView.tsx` para que la petición a `/api/courses/:id/students` se realice siempre, independientemente del rol.
- **Razón**: Cumple con el requisito de "Miembros de la clase" solicitado por el usuario.
- **Alternativa**: Crear un endpoint específico para alumnos. Descartado para mantener la simplicidad, ya que el endpoint existente es seguro.

### 3. Reemplazo del bloque de Evaluación
- **Decisión**: Sustituir el JSX del bloque de "Evaluación" por un componente que renderice una previsualización de los miembros (avatares) y el total.
- **Razón**: El bloque de evaluación actual es 100% estático y no tiene funcionalidad. Reemplazarlo por miembros aprovecha mejor el espacio.

## Risks / Trade-offs

- **[Riesgo]** La población profunda en MongoDB puede ser lenta si el número de cursos es muy alto. → **Mitigación**: Los alumnos suelen tener un número limitado de asignaturas (5-10), por lo que el impacto es despreciable.
- **[Riesgo]** Privacidad de datos de alumnos. → **Mitigación**: Solo se muestra nombre, apellidos y foto de perfil a compañeros de la misma asignatura.
