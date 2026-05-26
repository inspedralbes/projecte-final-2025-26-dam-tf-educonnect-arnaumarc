## Context

El proyecto se encuentra en la etapa final de entrega. Tras sincronizar el estado del servidor con el repositorio local, se ha identificado una acumulación de deuda técnica visual, rastro de módulos descartados (Expo, Discord), errores de codificación (mojibake) y archivos de depuración que ensucian el repositorio. Se requiere una limpieza quirúrgica para presentar un producto profesional y funcional en su núcleo web.

## Goals / Non-Goals

**Goals:**
- Eliminar por completo el rastro de `expo-mobile` y `bot-discord` en los procesos de instalación, construcción y estructura de archivos.
- Ocultar la navegación a secciones "En construcción" (Talleres).
- Mantener y asegurar que la sección "Centro" en el dashboard docente sea informativa (avisos institucionales).
- Normalizar el encoding de toda la documentación a UTF-8.
- Eliminar archivos de depuración (`topics_debug.json`).
- Limpiar placeholders y TODOs en la documentación de entrega.

**Non-Goals:**
- Eliminar físicamente las vistas de "Talleres" (solo se oculta el acceso).
- Refactorizar lógica de negocio compleja que ya funciona (ej. sistema de notificaciones web).
- Añadir nuevas funcionalidades.

## Decisions

- **Ocultación de UI**: Se eliminará el botón de "Talleres" del componente `Navbar.tsx` para alumnos. Se mantendrá el botón de "Centro" (o "Avisos") en el Dashboard docente, asegurando que no muestre estados de error si el backend no tiene mensajes reales.
- **Eliminación de Discord**: Se borrará la carpeta `main/bot-discord/` y se eliminará de los scripts de `main/package.json` y del array de módulos en `main/setup.js`.
- **Normalización de Encoding**: Se realizará una búsqueda y reemplazo masivo de patrones comunes de mojibake (ej. `Ã³` -> `ó`, `Ã¨` -> `è`) en la carpeta `doc/` y archivos `.js` identificados.
- **Simplificación de Setup**: Se actualizará `main/setup.js` para que solo instale las dependencias de `frontend` y `backend`.
- **Higiene de Archivos**: Se eliminarán todos los archivos `topics_debug.json`. Se revisará el `.gitignore` para prevenir futuras inclusiones.

## Risks / Trade-offs

- **[Riesgo]** Errores de tipado al ocultar vistas → **[Mitigación]** Mantener la definición del enum y el componente, pero eliminar el disparador de navegación.
- **[Riesgo]** Referencias huérfanas al bot de Discord → **[Mitigación]** Grep exhaustivo para eliminar cualquier `require` o script que apunte a la carpeta del bot.
- **[Riesgo]** Pérdida de información al limpiar TODOs → **[Mitigación]** Verificar que los TODOs eliminados sean puramente administrativos y no requisitos técnicos pendientes.
- **[Riesgo]** Inconsistencia en el encoding → **[Mitigación]** Configurar VS Code para forzar UTF-8 y realizar comprobaciones manuales en los archivos clave.
