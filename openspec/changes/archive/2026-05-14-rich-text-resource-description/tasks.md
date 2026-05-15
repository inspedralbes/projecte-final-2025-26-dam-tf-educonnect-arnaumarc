## 1. Cambios en el Backend (Core)

- [x] 1.1 Actualizar el modelo `Event.js` para incluir el campo `description` (String).
- [x] 1.2 Implementar `deleteEvent` en `eventController.js`.
- [x] 1.3 Registrar la ruta `DELETE /api/events/:id` en `eventRoutes.js`.
- [x] 1.4 (Opcional) Asegurar que el borrado de un evento también se notifique o se limpie de las vistas en tiempo real.

## 2. Configuración de Dependencias (Frontend)

- [x] 2.1 Instalar dependencias de Tiptap: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`, `@tiptap/extension-color`, `@tiptap/extension-text-style`, `@tiptap/extension-image`.

## 3. Integración del Editor Modular

- [x] 3.1 Crear un componente wrapper para el Editor de Texto Enriquecido que sea reutilizable.
- [x] 3.2 Integrar el editor en el modal de **Recursos**.
- [x] 3.3 Integrar el editor en el modal de **Agenda (Eventos)**.
- [x] 3.4 Integrar el editor en el modal de **Notificaciones (Anuncios)**.

## 4. Gestión de Borrado de Eventos

- [x] 4.1 Añadir botón de borrado (Icono Trash2 de Lucide) en las tarjetas de eventos de la agenda.
- [x] 4.2 Implementar `handleDeleteEvent` en `CourseDetailsView.tsx` con llamada a la nueva API.
- [x] 4.3 Implementar lógica de confirmación (`window.confirm` o modal personalizado) antes de ejecutar el borrado.

## 5. Visualización y Estilos

- [x] 5.1 Actualizar la renderización de recursos y eventos para procesar HTML de forma segura.
- [x] 5.2 Definir estilos CSS para tablas, listas y colores dentro del contenido rico.
- [x] 5.3 Asegurar responsividad (scroll horizontal) para tablas en dispositivos móviles.
