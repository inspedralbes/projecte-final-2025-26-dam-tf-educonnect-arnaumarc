## Why

Debido a limitaciones de tiempo y la proximidad de la fecha de entrega, se ha decidido descartar la aplicación móvil (Expo) del alcance del proyecto. Esto permitirá concentrar todos los esfuerzos en pulir y estabilizar los componentes principales: la plataforma Web (Frontend y Backend) y el Bot de Discord. 

El objetivo es realizar una limpieza profunda para eliminar código muerto y referencias obsoletas, asegurando que el proyecto sea presentable, profesional y no contenga "cables sueltos" que puedan confundir al tribunal.

## What Changes

- **REMOVAL**: Eliminación completa del directorio `main/expo-mobile`.
- **MODIFICATION**: Actualización de los scripts de construcción y despliegue en `main/package.json` para eliminar referencias a Expo.
- **MODIFICATION**: Limpieza de la documentación técnica y de usuario (`doc/`) para eliminar instrucciones, diagramas y menciones a la aplicación móvil.
- **MODIFICATION**: Actualización de las especificaciones globales (`openspec/specs/`) para reflejar que el sistema es puramente Web + Bot.
- **MODIFICATION**: Ajuste del script generador de assets (`tools/generate-required-assets.mjs`) para eliminar "Mobile" de los documentos generados.

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `deployment-guides`: Se eliminan los pasos de despliegue para la aplicación móvil.
- `project-documentation`: Se actualiza el mapa del sistema para omitir el módulo móvil.
- `user-manual`: Se eliminan las secciones referentes al uso de la aplicación móvil y notificaciones push.
- `meet-responsive-layout`: Se ajustan los requisitos para centrarse exclusivamente en la adaptabilidad web (mobile-web) en lugar de una app nativa.

## Impact

- **Código**: Se reduce la superficie de ataque y el ruido visual eliminando el directorio `main/expo-mobile`.
- **Scripts**: Los comandos `npm run install-all` y `npm run start-all` ya no intentarán interactuar con Expo.
- **Documentación**: Los PDFs y manuales generados serán consistentes con el alcance actual del proyecto.
- **No breaking changes for Web/Backend**: El backend seguirá funcionando normalmente para la web y el bot, ya que no depende estrictamente de la app móvil.
