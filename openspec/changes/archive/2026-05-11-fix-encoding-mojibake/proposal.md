## Why

Se han detectado múltiples errores de codificación de caracteres (mojibake) en la interfaz de usuario, especialmente en la sección de "Asignaturas" y en las notificaciones. Caracteres especiales del español (como tildes y eñes) se muestran de forma incorrecta (ej. "DescripciÃ³n" en lugar de "Descripción"). Esto afecta la profesionalidad y legibilidad de la plataforma.

## What Changes

- Corrección de todas las cadenas de texto estáticas en el frontend que presentan problemas de codificación.
- Corrección de mensajes de error y títulos de notificaciones en el backend que presentan el mismo problema.
- Normalización de los archivos afectados a codificación UTF-8 pura para evitar regresiones.

## Capabilities

### New Capabilities
- `encoding-standardization`: Establece la normativa de usar UTF-8 en todo el proyecto y corrige las desviaciones actuales.

### Modified Capabilities
- `unified-resource-management`: Se ajustarán los textos de la interfaz de recursos que presentan errores.

## Impact

- **Frontend**: `main/frontend/views/CourseDetailsView.tsx`, `main/frontend/components/NotificationPanel.tsx`.
- **Backend**: `main/backend/src/controllers/courseController.js`, `main/backend/src/controllers/notificationController.js`.
- **Usuario**: Mejora inmediata en la legibilidad y calidad visual de la aplicación.
