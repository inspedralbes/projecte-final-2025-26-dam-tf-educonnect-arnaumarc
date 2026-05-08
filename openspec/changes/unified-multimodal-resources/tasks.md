## 1. Actualización de Modelos y Tipos (Backend & Frontend)

- [x] 1.1 Modificar `resourceSchema` en `main/backend/src/models/Topic.js` para añadir los campos `link` y `dueDate`, y actualizar el enum de `type`.
- [x] 1.2 Actualizar la interfaz `Resource` en `main/frontend/types.ts` para incluir los nuevos campos y tipos.

## 2. Rediseño del Modal de Creación en Frontend

- [x] 2.1 Modificar el estado inicial y el formulario del modal de añadir recurso en `CourseDetailsView.tsx`.
- [x] 2.2 Implementar la lógica para mostrar el campo `Fecha Límite` solo cuando el tipo seleccionado es `task`.
- [x] 2.3 Asegurar que todos los campos (título, descripción, link, archivo) se envíen correctamente a la API.

## 3. Actualización de la Visualización de Recursos

- [x] 3.1 Refactorizar la renderización de la lista de recursos en `CourseDetailsView.tsx` para mostrar la tarjeta multimodal.
- [x] 3.2 Añadir visualización condicional para el enlace web y el archivo adjunto dentro de la misma tarjeta.
- [x] 3.3 Mostrar la fecha límite de entrega (si existe) con un icono de reloj y formato amigable.

## 4. Ajustes Finales y Validación

- [x] 4.1 Verificar que los recursos antiguos se siguen visualizando correctamente (compatibilidad).
- [x] 4.2 Añadir iconos diferenciadores para los nuevos tipos de recursos consolidados.

## 5. Flexibilización de Campos (Nuevos Requisitos)

- [x] 5.1 Eliminar la obligatoriedad del campo `title` en el modelo `Topic.js` (backend).
- [x] 5.2 Eliminar el atributo `required` del campo Título en el frontend y validar que al menos un campo tenga contenido.
- [x] 5.3 Asegurar que la visualización de recursos maneje correctamente la ausencia de título.

## 6. Funcionalidad de Edición

- [x] 6.1 Implementar `updateResource` en `topicController.js` (backend).
- [x] 6.2 Configurar la ruta PUT en `topicRoutes.js` (si existe) o el archivo correspondiente.
- [x] 6.3 Añadir estado `editingResourceId` y lógica para abrir el modal en modo edición en `CourseDetailsView.tsx`.
- [x] 6.4 Implementar `handleUpdateResource` en el frontend para enviar los cambios.
- [x] 6.5 Añadir el botón de edición (icono lápiz) en las tarjetas de recursos.
