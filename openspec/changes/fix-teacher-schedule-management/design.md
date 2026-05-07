## Context

El sistema actual sufre de un fallo de integración donde el `TeacherDashboardView` no recibe los datos del usuario, lo que rompe el filtrado de asignaturas. Además, el modelo de gestión de horarios asume erróneamente un entorno de "Aula Única", lo que impide el uso concurrente del sistema por varios profesores en diferentes espacios.

## Goals / Non-Goals

**Goals:**
- Corregir el paso de propiedades (`props`) en el componente raíz `App.tsx`.
- Evolucionar el `ScheduleEditor` para soportar selección de aula y visualización de ocupación externa.
- Implementar granularidad de 30 minutos en el horario para mayor flexibilidad.
- Fortalecer la validación del backend para manejar múltiples aulas de forma concurrente.

**Non-Goals:**
- No se creará una interfaz de administración de aulas (CRUD de aulas) en esta fase. Se usará una lista predefinida o se extraerán del esquema actual.
- No se modificará el esquema de base de datos de `Schedule`, ya que el campo `classroom` (String) es suficiente por ahora.

## Decisions

### 1. Inyección de Propiedades en el Dashboard
- **Decisión**: Pasar el objeto `user` directamente al componente `TeacherDashboardView` en `App.tsx`.
- **Razón**: Es la forma más directa de resolver el bug de "asignaturas vacías" sin recurrir a estados globales complejos o re-fetching innecesario.

### 2. Gestión de Aulas y Conflictos
- **Decisión**: Añadir un selector de aula en `ScheduleEditor` que dispare un re-fetch o re-filtrado de las sesiones.
- **Razón**: Permite al profesor ver la disponibilidad de un espacio antes de intentar reservar.
- **Implementación**: Se añadirá el parámetro `?classroom=` al endpoint `GET /api/schedule` para que el backend filtre opcionalmente por aula.

### 3. Granularidad del Horario (30 min)
- **Decisión**: Cambiar la visualización del grid de 1 hora a bloques de 30 minutos.
- **Razón**: Necesario para permitir clases que empiecen tras el patio (11:30) o sesiones de duración no entera (1.5h, 2.5h).
- **Alternativa**: Mantener bloques de 1h y usar popups. Descartado por ser menos intuitivo para visualizar el tiempo real ocupado.

### 4. Capa de Visualización "Ocupado"
- **Decisión**: Las sesiones que pertenecen a otros cursos pero coinciden en el aula seleccionada se mostrarán en un estado "Bloqueado" (semi-transparente y sin botón de borrar).
- **Razón**: Evita la confusión del usuario al ver huecos vacíos que realmente están ocupados en el aula.

## Risks / Trade-offs

- **[Riesgo]** → El grid de 30 minutos duplica el número de filas en la interfaz.
  - **Mitigación** → Implementar scroll interno en el contenedor del horario y optimizar el renderizado de los componentes de celda.
- **[Riesgo]** → Inconsistencia en nombres de aulas (strings).
  - **Mitigación** → Usar un `enum` o una lista cerrada en el frontend para asegurar que "Aula 1" y "aula 1" no se traten como diferentes.
