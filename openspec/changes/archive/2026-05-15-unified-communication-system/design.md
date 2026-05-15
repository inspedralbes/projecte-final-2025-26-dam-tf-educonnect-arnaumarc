## Context

El sistema actual separa los avisos manuales de los profesores (mensajes) de los avisos automáticos del sistema (notificaciones de nuevos temas, tareas, etc.). Esto fragmenta la experiencia del alumno, quien debe revisar la "campana" para lo automático y el "tablón" para lo manual. Además, el Tablón carece de persistencia real para las notificaciones, perdiendo información valiosa al recargar. En la vista de Meet, no existe canal de texto, dificultando el intercambio de enlaces o dudas rápidas sin interrumpir el audio.

## Goals / Non-Goals

**Goals:**
- Unificar la visualización de mensajes y notificaciones en un único "Feed" en el Tablón.
- Implementar agrupación visual de notificaciones repetitivas (ej: "5 nuevos materiales").
- Añadir un chat de sesión y directo en la vista de Meet.
- Centralizar la gestión de Sockets para evitar fugas de memoria y desincronización.

**Non-Goals:**
- No se creará un sistema de chat persistente complejo tipo Slack/Discord (fuera de mensajes directos).
- No se modificarán los esquemas de base de datos existentes de forma disruptiva (solo se añadirán metadatos opcionales).

## Decisions

### 1. Modelo de Datos Unificado en Frontend (`FeedItem`)
Se creará una interfaz que unifique `Message` y `Notification`.
- **Rationale**: Permite usar un solo componente de renderizado y lógica de filtrado común.
- **Alternativa**: Mantener arrays separados, lo que duplicaría la lógica de UI y ordenación.

### 2. Centralización en `SocketContext`
Toda la lógica de recepción de avisos se moverá al context global.
- **Rationale**: Evita que al navegar entre vistas se pierdan eventos de socket o se dupliquen listeners.
- **Alternativa**: Seguir usando listeners locales en cada vista (causa el problema actual de "mensajes que desaparecen").

### 3. Agrupación por Ventana Temporal y Curso
Las notificaciones del mismo tipo (`MATERIAL`, `TOPIC`) para el mismo `courseId` recibidas en un margen de 48h se agruparán.
- **Rationale**: Reduce el ruido visual drásticamente.
- **Alternativa**: Mostrar cada aviso individualmente (causa colapso del Tablón).

### 4. Chat en Meet mediante Panel Lateral
Se añadirá un componente `ChatPanel` a la derecha de la vista de Meet.
- **Rationale**: Es el patrón estándar en herramientas de videoconferencia.
- **Alternativa**: Un chat flotante (más complejo de gestionar en pantallas pequeñas).

## Risks / Trade-offs

- **[Riesgo]** Carga de datos excesiva al traer notificaciones y mensajes juntos. → **Mitigación**: Implementar paginación o límite de 20 elementos por categoría.
- **[Riesgo]** Complejidad en la lógica de agrupación en el cliente. → **Mitigación**: Usar una función pura de "reduce" para transformar el array de entrada antes del renderizado.
- **[Trade-off]** Al centralizar sockets, el context pesará más. → **Mitigación**: Segmentar la lógica del context en hooks especializados si es necesario.
