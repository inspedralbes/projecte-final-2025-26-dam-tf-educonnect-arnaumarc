## 1. Cambios en el Modelo y Backend

- [x] 1.1 Actualizar el modelo `Event.js` para incluir `topicId`, `modality` y `status`.
- [x] 1.2 Actualizar el controlador `eventController.js` para manejar los nuevos campos en la creación y edición.
- [x] 1.3 Asegurar que el endpoint de obtener eventos de un curso devuelva los nuevos campos.

## 2. Actualización de Tipos y API en el Frontend

- [x] 2.1 Actualizar la interfaz `Event` en `frontend/types.ts` para incluir los nuevos campos.
- [x] 2.2 Actualizar los servicios o hooks que interactúan con eventos para soportar la creación con tema y modalidad.

## 3. Rediseño de la pestaña "Recursos & Agenda"

- [x] 3.1 Modificar `CourseDetailsView.tsx` para agrupar los eventos por `topicId` tras la carga de datos.
- [x] 3.2 Implementar la nueva estructura visual: Temas como acordeones raíz que contienen recursos y eventos.
- [x] 3.3 Añadir una sección de "Eventos sin clasificar" para eventos que no tengan `topicId` asignado.

## 4. Modals y Gestión de Estados

- [x] 4.1 Actualizar el modal de añadir evento para incluir selectores de Tema y Modalidad (Papel/Digital).
- [x] 4.2 Implementar la funcionalidad para que el profesor cambie el estado (`status`) de un evento directamente desde la vista de detalles.
- [x] 4.3 Añadir feedback visual (badges) para distinguir modalidades y estados en la lista de eventos.
