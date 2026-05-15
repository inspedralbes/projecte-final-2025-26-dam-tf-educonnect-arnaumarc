## Context

El sistema utiliza actualmente `<textarea>` básicos y los eventos de la agenda carecen de descripciones. La falta de un flujo de borrado para eventos genera datos huérfanos imposibles de eliminar por el usuario. Se busca unificar la experiencia de edición rica sin mezclar los flujos de trabajo (Recursos y Agenda permanecen como entidades separadas).

## Goals / Non-Goals

**Goals:**
- Implementar Tiptap en Recursos, Agenda y Notificaciones.
- Añadir campo `description` a los Eventos en DB.
- Implementar borrado definitivo de eventos con confirmación visual.
- Asegurar que el contenido se visualice correctamente tanto en modo claro como oscuro.

**Non-Goals:**
- Unificar los modales de creación (se mantienen separados por claridad funcional).
- Implementar una "Papelera" (el borrado será definitivo tras la confirmación).

## Decisions

- **Librería de Editor: Tiptap.**
    - *Rationale:* Headless y altamente modular. Ideal para integrarse con los estilos de Tailwind/CSS del proyecto.
- **Backend: Extensión del Modelo Event.**
    - Se añadirá `description: String` al esquema para permitir que los hitos de la agenda también sean "ricos".
- **UX: Confirmación de Borrado.**
    - No se borrará nada con un solo clic. Se usará un estado de confirmación local o el diálogo nativo `window.confirm` para una validación rápida pero segura.
- **Renderización: Contenedor HTML.**
    - Se usará un componente wrapper que aplique estilos específicos a las tablas y listas generadas por el editor para evitar que "rompan" el layout.

## Risks / Trade-offs

- **[Riesgo] Coherencia visual** → **Mitigación**: Se definirá un conjunto de estilos CSS globales para el contenido rico (`.rich-content-view`) que se aplicará uniformemente en tarjetas de recursos y detalles de eventos.
- **[Riesgo] Migración de datos** → **Mitigación**: Los eventos antiguos simplemente tendrán la descripción vacía; no se requiere transformación de datos existentes.
- **[Riesgo] Seguridad (XSS)** → **Mitigación**: Aunque es un entorno de profesores, se recomienda el uso futuro de sanitización si el proyecto crece más allá del prototipo.
