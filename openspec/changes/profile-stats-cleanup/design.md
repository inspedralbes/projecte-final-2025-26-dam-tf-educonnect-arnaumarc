## Context

El perfil de usuario de EduConnect muestra actualmente estadísticas estáticas que no reflejan la realidad del alumno. El backend ya cuenta con modelos de `Submission` y `Message` que pueden ser utilizados para generar estadísticas reales.

## Goals / Non-Goals

**Goals:**
- Proporcionar datos reales de participación (entregas y actividad) en el perfil.
- Eliminar placeholders estáticos ("8.5" de promedio y "4" certificados).
- Mantener la estética actual del perfil pero con datos dinámicos.

**Non-Goals:**
- Implementar un sistema complejo de cálculo de notas finales (promedio real) en este cambio.
- Crear un sistema de emisión de certificados reales.

## Decisions

- **Extensión de API**: Se añadirá un objeto `stats` a la respuesta del usuario en `/api/user/:id` que incluirá `submissionsCount` y `activityCount`.
- **Agregación en Backend**: Se utilizarán consultas `countDocuments` en MongoDB para calcular estas estadísticas bajo demanda al cargar el perfil.
- **Frontend Sync**: El `ProfileView.tsx` se actualizará para leer estos campos del objeto `user`.

## Risks / Trade-offs

- **[Riesgo] Performance**: Contar documentos cada vez que se carga el perfil podría ser lento con miles de registros.
- **[Mitigación]**: Por ahora el volumen es bajo. Si crece, se pueden cachear los contadores en el modelo de usuario o usar una tarea programada para actualizarlos.
