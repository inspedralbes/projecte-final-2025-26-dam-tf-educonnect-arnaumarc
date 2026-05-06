## Context

El sistema actual tiene horarios fijos definidos en el `seed`. Se requiere una transición a un modelo dinámico donde el profesor pueda ajustar las horas de sus clases respetando restricciones de aula única y bloques de tiempo prohibidos (patio y comida).

## Goals / Non-Goals

**Goals:**
- Implementar una bolsa de horas (4-6h) por curso.
- Permitir sesiones de 1h o 2h.
- Validar solapamientos en la única aula disponible.
- Respetar los rangos: Mañana (08:00-14:00) y Tarde (15:00-21:00).
- Bloquear Patio (11:00-11:30) y Comida (14:00-15:00).

**Non-Goals:**
- Gestionar múltiples aulas (se asume una única aula para este cambio).
- Gestión de horarios de alumnos (solo profesores editan).

## Decisions

### 1. Esquema de Datos
- **Course**: Se añadirá `totalWeeklyHours` (Number).
- **Schedule**: Se mantendrá la estructura pero se añadirá lógica de validación previa al guardado (middleware o controller logic).

### 2. Algoritmo de Validación de Conflictos
Se implementará una función `checkConflict(day, start, end)` que:
1. Verifique si el rango está dentro de los turnos permitidos.
2. Verifique si el rango interseca con los bloques de descanso (patio/comida).
3. Verifique si existe otra entrada en `Schedule` para ese `day` que se solape en tiempo.

### 3. Interfaz de Usuario
- Se creará una vista `ScheduleEditor` donde se visualice el horario actual y se permitan clics en huecos libres para añadir sesiones.
- Las zonas prohibidas (patio/comida) se mostrarán visualmente bloqueadas.

## Risks / Trade-offs

- **[Risk]** → La validación solo en el frontend podría permitir datos corruptos.
- **[Mitigation]** → Implementar validación estricta en el controlador del backend antes de cualquier `save()`.
- **[Risk]** → Rendimiento al buscar conflictos.
- **[Mitigation]** → Con una sola aula y pocos cursos, las consultas indexadas por `day` en MongoDB son extremadamente rápidas.
