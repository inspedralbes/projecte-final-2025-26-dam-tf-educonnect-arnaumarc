## Context

El proyecto presenta inconsistencias en la codificación de caracteres en archivos específicos del frontend y del backend. Esto ha resultado en "mojibake" (caracteres corruptos) visibles para el usuario final.

## Goals / Non-Goals

**Goals:**
- Corregir todas las cadenas de texto corruptas identificadas en el frontend y backend.
- Asegurar que los archivos afectados se guarden con codificación UTF-8 (sin BOM).
- Verificar que las respuestas de la API utilicen el charset correcto.

**Non-Goals:**
- No se realizará una auditoría completa de cada archivo del proyecto, solo de los identificados con problemas.
- No se implementará un sistema de internacionalización (i18n) en esta fase, solo se corregirán los textos en español existentes.

## Decisions

### Estrategia de Corrección: Reemplazo Directo de Cadenas
- **Decisión**: Se realizarán reemplazos de las cadenas corruptas (ej. `InformaciÃ³n`) por sus versiones correctas (ej. `Información`).
- **Razón**: Es la forma más rápida y efectiva de limpiar el código de artefactos de codificación previa.
- **Alternativa**: Intentar re-codificar los archivos mediante herramientas de consola (iconv). Se descartó porque los archivos ya contienen una mezcla de codificaciones o caracteres ya perdidos/transformados que requieren intervención manual para asegurar la ortografía correcta.

### Normalización de Archivos a UTF-8
- **Decisión**: Forzar el guardado de los archivos modificados en UTF-8 puro.
- **Razón**: Garantizar la consistencia con el resto del proyecto que ya utiliza este estándar.

## Risks / Trade-offs

- **[Riesgo]** Introducir errores tipográficos al corregir manualmente. → **Mitigación**: Revisión cuidadosa y uso de búsquedas globales para encontrar patrones comunes (`Ã³`, `Ã¡`, etc.).
- **[Riesgo]** Archivos de datos (ej. `.env` o `.sql`) también afectados. → **Mitigación**: Revisar `init.sql` y archivos de configuración para asegurar que las semillas de datos no propaguen el error.
