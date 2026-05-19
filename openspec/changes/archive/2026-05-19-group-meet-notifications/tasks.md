## 1. Frontend: Actualización de la Lógica de Agrupación

- [x] 1.1 Modificar la función `groupFeed` en `main/frontend/views/TablonView.tsx` para detectar eventos de Meet (`MEET_CALL`, `MEET_MESSAGE`).
- [x] 1.2 Implementar la búsqueda de eventos similares basados en `sender._id` y el mismo día natural (`toDateString`).
- [x] 1.3 Asegurar que los grupos generados tengan el título dinámico: `Actividad reciente en Meet de [Nombre Remitente]`.

## 2. Frontend: Mejoras en el Renderizado de Grupos

- [x] 2.1 Actualizar el bloque de renderizado de grupos en `TablonView.tsx` para usar el icono `Phone` cuando el grupo sea de tipo Meet.
- [x] 2.2 Verificar que el contador de elementos en el título del grupo funcione correctamente para los eventos de Meet.

## 3. Validación

- [x] 3.1 Simular la recepción de múltiples mensajes y llamadas de Meet del mismo profesor en el mismo día y verificar su agrupación.
- [x] 3.2 Verificar que eventos de Meet de diferentes profesores o diferentes días NO se mezclen en el mismo grupo.
- [x] 3.3 Confirmar que la agrupación de materiales de clase sigue funcionando sin alteraciones.
