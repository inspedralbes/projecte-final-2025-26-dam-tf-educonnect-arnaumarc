## Context

El componente `ProfileView.tsx` actualmente está en español, con iconos importados de `lucide-react` que no se utilizan (`Shield`, `Bell`, `CreditCard`) y lógicas sin función (un `useEffect` vacío). Además, la sección de preferencias maneja el modo oscuro pero la estructura puede ser simplificada. Para mejorar la mantenibilidad y alinear la aplicación con los esfuerzos de internacionalización (catalán), se requiere un rediseño de este componente a nivel visual (textos) y de limpieza de código, manteniendo el comportamiento actual.

## Goals / Non-Goals

**Goals:**
- Traducir todos los textos de la interfaz de `ProfileView.tsx` al catalán.
- Limpiar el código eliminando imports no utilizados y hooks vacíos.
- Verificar y asegurar que los campos dinámicos (Cursos, Entregues) no dependan innecesariamente de datos "mock".
- Mantener la funcionalidad actual del cambio de tema (Modo Fosc).

**Non-Goals:**
- Implementar un sistema completo de internacionalización (como i18next). Se hardcodearán los textos en catalán directamente en el componente para esta fase.
- Modificar el backend o los modelos de datos de usuario.
- Rediseñar completamente la interfaz de usuario del perfil más allá de la limpieza y traducción.

## Decisions

- **Traducción Directa**: Dado que la aplicación aún no cuenta con un sistema formal de i18n, los textos en `ProfileView.tsx` serán modificados directamente al catalán ("Ajustos", "Preferències", "Nom Complet", etc.).
- **Limpieza de Imports**: Se eliminarán de la declaración `import { ... } from 'lucide-react'` aquellos iconos que el IDE detecte como no utilizados, específicamente `Shield`, `Bell`, `CreditCard` (según se encontró en la exploración).
- **Remoción de Código Muerto**: Se eliminará el bloque `useEffect(() => { ... }, []);` que no tiene operaciones en su interior.

## Risks / Trade-offs

- **[Riesgo] Textos Hardcodeados**: Al no usar i18n, futuras traducciones a otros idiomas requerirán volver a tocar el código.
  - **Mitigación**: Es un trade-off aceptable para el alcance de este cambio, focalizado únicamente en la adaptación actual al catalán y limpieza.
- **[Riesgo] Conflictos con `profile-stats-cleanup`**: Otra propuesta está modificando las estadísticas.
  - **Mitigación**: Esta propuesta (`profile-catalan-and-cleanup`) se centra en los textos fijos y la limpieza de imports, que deberían fusionarse fácilmente con los cambios dinámicos de las estadísticas si ocurren en paralelo.