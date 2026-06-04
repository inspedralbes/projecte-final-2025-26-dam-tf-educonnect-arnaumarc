## Why

La vista de perfil actual (`ProfileView.tsx`) necesita ser adaptada al catalán como parte del proceso de internacionalización de la plataforma. Además, contiene elementos (iconos) no utilizados y componentes de estado "mock" o "fantasma" que pueden ser limpiados o verificados para asegurar que todos los campos presentados tengan una función real y no sean restos de versiones anteriores, mejorando así la claridad y mantenibilidad del código.

## What Changes

- **Traducción**: Se traducirán los textos de la vista de perfil (`ProfileView.tsx`) del español al catalán (Ej: "Información Personal" -> "Informació Personal", "Ajustes" -> "Ajustos").
- **Limpieza**: Se eliminarán imports no utilizados (como `Shield`, `Bell`, `CreditCard` de `lucide-react`) y `useEffect` vacíos.
- **Verificación**: Se verificará que los campos como "Cursos" y "Entregues" funcionen con datos reales y se removerá cualquier dependencia innecesaria a `MOCK_USER` si es posible simplificar la lógica de respaldo.
- **Mantenimiento**: La estructura visual general y la funcionalidad del modo oscuro en la sección de preferencias se mantendrán intactas, solo se aplicarán las traducciones.

## Capabilities

### New Capabilities
- `ui-localization-catalan`: Capacidad para presentar la interfaz de usuario en catalán, comenzando por la vista de perfil.

### Modified Capabilities
- `course-details-enhancement`: Puede que los campos de los cursos y las entregas necesiten asegurar coherencia con los datos reales mostrados en el perfil.

## Impact

- **Frontend**: El componente `main/frontend/views/ProfileView.tsx` será el principal afectado.
- **Traducción**: Impacto visual directo en la experiencia de usuario para la comunidad catalanohablante.