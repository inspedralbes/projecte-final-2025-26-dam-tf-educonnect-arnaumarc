## Why

El perfil de usuario actualmente muestra datos estáticos (mock) como el "Promedio" y los "Certificados" que no reflejan la actividad real del alumno. Esto resta credibilidad a la plataforma y confunde al usuario. Queremos sustituir estas "mentiras" visuales por datos reales que el sistema ya posee, como el conteo de entregas realizadas y mensajes recibidos.

## What Changes

- **Remoción**: Se eliminará el campo estático "Promedio" (fijado en 8.5) de la vista de perfil del alumno.
- **Remoción**: Se eliminará el campo estático "Certificados" (fijado en 4) de la vista de perfil del alumno.
- **Adición**: Se implementará un contador de "Entregas Realizadas" basado en las entregas reales del alumno en la base de datos.
- **Adición**: Se implementará un contador de "Mensajes" o "Actividad" basado en la interacción real del usuario.
- **Backend**: Creación de un endpoint o extensión de `userController` para obtener estadísticas reales del usuario (conteo de entregas y mensajes).

## Capabilities

### New Capabilities
- `user-statistics`: Capacidad para agregar y consultar estadísticas de actividad real del usuario (entregas, mensajes, actividad).

### Modified Capabilities
- `submission-tracking`: Se añadirán requisitos para que el sistema proporcione resúmenes estadísticos de las entregas por usuario.

## Impact

- **Frontend**: `ProfileView.tsx` será modificado para mostrar los nuevos datos dinámicos.
- **Backend**: `userController.js` y `submissionController.js` para proveer los datos agregados.
- **API**: Nuevo endpoint o campos adicionales en `/api/user/:id`.
