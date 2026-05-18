## Context

El sistema actual emite notificaciones directas sin agregación, lo que satura la interfaz. Los eventos de Meet son volátiles y solo existen mientras el socket está conectado. El usuario no tiene un lugar centralizado para gestionar el flujo histórico de alertas.

## Goals / Non-Goals

**Goals:**
- Reducir el ruido visual mediante la agregación de notificaciones similares.
- Garantizar que las llamadas perdidas y mensajes de Meet queden registrados.
- Permitir la gestión de notificaciones desde Toasts y una vista de historial.

**Non-Goals:**
- Implementar notificaciones Push (PWA/Browser) en esta fase (se queda en notificaciones in-app).
- Cambiar el sistema de mensajería privada (solo su representación en notificaciones).

## Decisions

### 1. Agregación en el Servidor (Query-time)
**Decisión:** Las notificaciones se agruparán dinámicamente al consultarlas, no al guardarlas.
**Racional:** Permite mantener la integridad de cada evento individual (para el historial completo) mientras se presenta una UI limpia. Se agruparán por `type` + `meta.courseId` + `recipient` para ítems no leídos en las últimas 24h.
**Alternativa:** Agrupar en el guardado. Descartado porque perderíamos la trazabilidad de eventos individuales si el usuario quiere ver el detalle.

### 2. Persistencia de Eventos Meet
**Decisión:** Cada vez que el servidor reciba un evento de Socket `call_user` o `new_message` (Meet), se llamará internamente a un helper de creación de notificaciones persistentes.
**Racional:** Asegura que aunque el receptor no esté "en la sala" en ese momento, el registro quede en su base de datos personal.

### 3. Componente `InteractiveToast`
**Decisión:** Usar `react-hot-toast` con un componente personalizado que acepte una función de callback para marcar como leído.
**Racional:** Mejora la UX al permitir descartar notificaciones triviales sin romper el flujo de trabajo del usuario.

## Risks / Trade-offs

- **[Riesgo]** Latencia en la carga del panel si hay miles de notificaciones. → **Mitigación**: Implementar paginación (limit 20) y un índice en MongoDB por `recipient` y `createdAt`.
- **[Trade-off]** Complejidad en el frontend para manejar el estado de ítems agregados. → **Justificación**: Es necesario para una UI profesional.
