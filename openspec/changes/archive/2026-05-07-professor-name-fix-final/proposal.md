## Why

A pesar de la implementación inicial, el nombre del profesor seguía mostrándose como un ID en algunas vistas debido a problemas de persistencia en `localStorage` y transformaciones de datos prematuras en el frontend. Era necesario asegurar una sincronización robusta con el backend.

## What Changes

- **Sincronización Automática**: Se ha añadido un efecto en `App.tsx` que refresca los datos del usuario desde la API al iniciar la aplicación.
- **Refactorización de AsignaturasView**: Ahora se obtienen los cursos directamente de `/api/courses` para garantizar que los datos del profesor estén poblados.
- **Población en Backend**: Se ha extendido la población de datos en `userController.js` para cubrir todos los casos de uso (profesores y actualizaciones de perfil).

## Capabilities

### Modified Capabilities
- `course-details-enhancement`: Se refuerza el requisito de visualización de datos humanos asegurando la sincronización técnica.

## Impact

- **Frontend**: `App.tsx`, `AsignaturasView.tsx`.
- **Backend**: `userController.js`.
