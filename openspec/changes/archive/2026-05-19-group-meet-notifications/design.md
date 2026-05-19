## Context

Actualmente, la función `groupFeed` en `TablonView.tsx` solo agrupa materiales y anuncios de curso por `courseId` y una ventana de 48h. No existe lógica de agrupación para eventos personales ni para eventos basados en el remitente (`sender`).

## Goals / Non-Goals

**Goals:**
- Implementar una nueva regla de agrupación en `groupFeed` para tipos `MEET_CALL` y `MEET_MESSAGE`.
- Agrupar por `sender._id` y por día (`toDateString`).
- Usar el componente de grupo existente para mostrar estos eventos de forma colapsable.

**Non-Goals:**
- Cambiar la base de datos (la agrupación es puramente visual en el Frontend).
- Agrupar mensajes directos (DM) normales (estos deben permanecer individuales por claridad).

## Decisions

### 1. Extensión de la lógica de `groupFeed`
Se añadirá un segundo bloque de búsqueda en el bucle de `groupFeed` específico para Meet.
- **Razón**: Permite mantener separadas las reglas de "Asignatura" (48h) de las de "Meet" (Mismo día + Remitente).
- **Lógica**: 
  ```javascript
  const sameSenderAndDay = items.filter(other => 
    other.id !== item.id &&
    (other.type === 'MEET_CALL' || other.type === 'MEET_MESSAGE') &&
    other.sender?._id === item.sender?._id &&
    new Date(other.date).toDateString() === new Date(item.date).toDateString()
  );
  ```

### 2. Título Dinámico del Grupo
El título se construirá usando el nombre del remitente disponible en el primer ítem del grupo.
- **Formato**: `Actividad reciente en Meet de ${item.sender.nombre} ${item.sender.apellidos}`.

## Risks / Trade-offs

- **[Riesgo]** Confusión si el usuario busca un mensaje específico dentro de un grupo colapsado. → **Mitigación**: Los grupos de Meet solo se aplicarán si hay más de un evento. Un solo evento de Meet seguirá siendo individual.
- **[Riesgo]** Performance con feeds muy grandes. → **Mitigación**: La agrupación se realiza solo sobre el feed ya categorizado por pestaña, lo que limita el número de elementos a procesar.
