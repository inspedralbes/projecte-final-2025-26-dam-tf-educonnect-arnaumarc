## Context

El proyecto EduConnect se concibió como un sistema multiplataforma (Web, Mobile, Bot). A medida que se acerca el final del ciclo de desarrollo, la aplicación móvil desarrollada con Expo ha quedado rezagada en comparación con la funcionalidad web. Para asegurar una entrega de alta calidad, se decide eliminar la aplicación móvil nativa y consolidar la experiencia móvil a través de la web responsiva.

## Goals / Non-Goals

**Goals:**
- Eliminar todo rastro de la aplicación móvil nativa (`expo-mobile`).
- Asegurar que todos los scripts de inicio y construcción funcionen correctamente sin Expo.
- Actualizar toda la documentación para que el tribunal no encuentre referencias a una funcionalidad inexistente.
- Garantizar que la web y el bot sigan operando sin efectos secundarios.

**Non-Goals:**
- Eliminar la adaptabilidad responsiva de la web (la web seguirá funcionando en navegadores móviles).
- Eliminar el sistema de notificaciones del backend (se mantendrá por si se desea usar para el bot o web notifications en el futuro, pero se desvincula de Push Notifications de Expo).
- Realizar refactorizaciones profundas del backend que no estén relacionadas con la eliminación de la app móvil.

## Decisions

- **Eliminación vs Desactivación**: Se ha elegido la **eliminación total** del directorio `main/expo-mobile` en lugar de simplemente desactivarlo. Esto reduce el tamaño del repositorio y evita confusiones sobre si el código está mantenido o no.
- **Documentación**: Se editarán los archivos Markdown de `doc/` quirúrgicamente para eliminar secciones de "App Mòbil", pero manteniendo la estructura del resto del proyecto. Los diagramas de Mermaid se actualizarán para eliminar los nodos de la App.
- **Scripts de NPM**: Se modificarán los scripts en `main/package.json` para eliminar la cadena de comandos que entraba en `expo-mobile`.

## Risks / Trade-offs

- **[Riesgo] Rotura de scripts de CI/CD o locales** → **[Mitigación]** Probar localmente los comandos `npm run install-all` y `npm run build` tras los cambios.
- **[Riesgo] Referencias olvidadas en documentación** → **[Mitigación]** Realizar una búsqueda global (grep) tras la limpieza para asegurar que no queden términos como "Expo" o "Push" vinculados a la app móvil.
- **[Riesgo] Pérdida de código útil** → **[Mitigación]** El código permanecerá en el historial de Git por si en un futuro post-entrega se desea recuperar, pero el estado actual de la rama principal debe estar limpio.
