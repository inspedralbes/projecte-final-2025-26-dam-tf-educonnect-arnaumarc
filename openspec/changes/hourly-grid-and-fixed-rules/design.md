## Context

El usuario requiere una simplificación drástica del sistema de horarios. El grid actual de 30 minutos se percibe como demasiado detallado para clases que ahora serán solo de 1 o 2 horas. Además, se han ajustado los periodos de descanso para alinearse con las nuevas necesidades del centro.

## Goals / Non-Goals

**Goals:**
- Cambiar la granularidad del grid visual a bloques de 1 hora.
- Restringir las opciones de duración en el selector a 1h y 2h.
- Implementar validaciones estrictas para los nuevos rangos de patio (11:00-11:30) y comida (15:30-17:00).
- Asegurar que la interfaz visual represente correctamente los bloqueos de patio y comida aunque no coincidan exactamente con el inicio de los bloques de 1 hora.

**Non-Goals:**
- No se cambiará el modelo de datos subyacente de MongoDB.
- No se implementará lógica para redondear sesiones existentes a las nuevas reglas.

## Decisions

### 1. Granularidad del Grid de 1 Hora
- **Decisión**: Modificar la constante `HOURS` en `ScheduleEditor.tsx` para generar solo horas enteras (8:00, 9:00, ..., 21:00).
- **Razón**: Simplifica la interfaz y se alinea con el nuevo requisito de clases de 1/2 horas.

### 2. Gestión de Descansos "Fuera de Bloque" (Out-of-sync)
- **Decisión**: Mantener el cálculo interno basado en minutos en `ScheduleEditor.tsx`. Aunque el grid sea de 1 hora, las funciones `isPatio` e `isDescanso` validarán los rangos exactos (11:00-11:30 y 15:30-17:00). Visualmente, el bloque de las 11:00 se marcará como "Patio" (indicando que está parcialmente bloqueado) y el de las 15:00 se marcará como "Comida" (indicando que la segunda mitad está bloqueada).
- **Razón**: Permite mantener un grid limpio de 1 hora mientras se respeta la realidad de los descansos que no duran 1 hora exacta.

### 3. Restricción de Duraciones
- **Decisión**: Modificar el `<select>` de duraciones en el frontend y la lógica de validación en `createScheduleSession` (backend) para aceptar solo `1` y `2` como valores válidos de duración (en horas).
- **Razón**: Cumplimiento directo del requisito del usuario.

## Risks / Trade-offs

- **[Riesgo]** → Confusión visual si un bloque de 1 hora (ej. 11:00-12:00) está marcado como patio pero el patio solo dura 30 min.
  - **Mitigación** → Se añadirá un texto descriptivo o un estilo visual que indique que el bloque está "Parcialmente Ocupado" o simplemente se bloqueará el bloque completo para evitar solapamientos complejos en el grid simplificado.
- **[Riesgo]** → Sesiones de 2 horas que empiecen a las 10:00 colisionarán con el patio a las 11:00.
  - **Mitigación** → El backend ya maneja la lógica de solapamiento de rangos, por lo que rechazará estas sesiones correctamente.
