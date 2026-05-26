## Why

El proyecto EduConnect se encuentra en su fase final de entrega. Actualmente, el código contiene rastro de módulos descartados (Expo), secciones inacabadas (Talleres), errores de codificación de caracteres (mojibake) y archivos de depuración que restan profesionalidad al producto final. Además, se ha decidido prescindir de la integración con Discord para simplificar la entrega y centrarse en la estabilidad de las funciones principales. Esta "Llimpieza Final" es necesaria para asegurar que el tribunal reciba una solución pulida, coherente y enfocada exclusivamente en el núcleo web.

## What Changes

- **REMOVAL**: Eliminación definitiva de referencias a `expo-mobile` en `main/setup.js` y `main/package.json`.
- **MODIFICATION**: Ocultación de la sección "Talleres" en el `Navbar` del frontend para evitar mostrar contenido "en construcción".
- **REMOVAL**: Eliminación del módulo `main/bot-discord/` y todas sus referencias en el proyecto.
- **MODIFICATION**: Mantenimiento y pulido de la sección "Centro" en el Dashboard del profesor para avisos institucionales (estáticos o dinámicos según disponibilidad).
- **MODIFICATION**: Corrección global de errores de encoding (UTF-8) en todos los documentos de la carpeta `doc/` y archivos fuente detectados.
- **REMOVAL**: Borrado de archivos de depuración como `topics_debug.json` en la raíz y subdirectorios.
- **MODIFICATION**: Limpieza de etiquetas "TODO" y placeholders en los archivos Markdown de `doc/` para reflejar un estado de entrega final.

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `deployment-guides`: Eliminación de los pasos de despliegue para la aplicación móvil y el bot de Discord.
- `project-documentation`: Actualización del mapa del sistema para omitir el módulo móvil y Discord, reflejando la estructura de entrega A-J.
- `user-manual`: Eliminación de secciones móviles y de Discord, y corrección de caracteres corruptos.
- `encoding-standardization`: Aplicación estricta de UTF-8 en toda la documentación.

## Impact

- **Estructura**: Reducción drástica del ruido visual en el repositorio eliminando módulos no utilizados (Expo, Discord) y archivos temporales.
- **UX**: Mejora de la experiencia de usuario al eliminar puntos de navegación que llevan a secciones no funcionales (Talleres).
- **Calidad**: Documentación coherente, profesional y sin errores de lectura por encoding.
- **Despliegue**: Scripts de configuración (`setup.js`) más rápidos y alineados con el alcance real.
