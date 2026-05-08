## 1. Configuración de Dependencias

- [ ] 1.1 Instalar dependencias de Tiptap: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`, `@tiptap/extension-color`, `@tiptap/extension-text-style`, `@tiptap/extension-image`.

## 2. Integración del Editor en el Frontend

- [ ] 2.1 Crear el componente de Editor de Texto Enriquecido en `CourseDetailsView.tsx`.
- [ ] 2.2 Reemplazar el `<textarea>` de descripción en el modal por el nuevo editor.
- [ ] 2.3 Sincronizar el estado del editor con `newResource.content` para que se guarde correctamente.

## 3. Interfaz del Editor (Toolbar)

- [ ] 3.1 Implementar la barra de herramientas con botones para Negrita, Cursiva y Listas.
- [ ] 3.2 Añadir controles para la inserción y gestión de tablas.
- [ ] 3.3 Añadir selector de color de texto y opción para insertar imágenes (vía URL).
- [ ] 3.4 Estilizar el editor para que se adapte a los modos claro y oscuro del proyecto.

## 4. Visualización de Recursos

- [ ] 4.1 Actualizar la renderización de la descripción en la tarjeta de recurso para procesar HTML.
- [ ] 4.2 Añadir estilos CSS globales o locales para el contenido enriquecido (especialmente para tablas y listas).
- [ ] 4.3 Asegurar que las tablas tengan scroll horizontal en dispositivos móviles.
