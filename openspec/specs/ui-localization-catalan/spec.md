## ADDED Requirements

### Requirement: Traducción de la Interfaz de Perfil al Catalán
La vista de perfil del usuario MUST mostrar todos los textos estáticos en idioma catalán.

#### Scenario: Visualización del perfil
- **WHEN** un usuario accede a su vista de perfil
- **THEN** los encabezados, etiquetas e indicadores de rol se muestran en catalán (e.g., "Informació Personal", "Professor", "Ajustos").

### Requirement: Limpieza de Componentes en la Vista de Perfil
El código de la vista de perfil MUST estar libre de dependencias no utilizadas y bloques lógicos sin función para mejorar el rendimiento y la mantenibilidad.

#### Scenario: Revisión de dependencias del componente
- **WHEN** el sistema renderiza `ProfileView.tsx`
- **THEN** no se cargan iconos de `lucide-react` que no se usan (como Shield, Bell, CreditCard) ni se ejecutan hooks `useEffect` vacíos.
