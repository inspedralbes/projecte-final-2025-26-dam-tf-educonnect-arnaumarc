## Context

El sistema actual sufre de una desconexión entre el frontend y el backend debido al uso extensivo de "Mocks" (datos simulados) que no reflejan la realidad de la base de datos MongoDB. Esto causa que el horario se vea vacío o con datos inconsistentes. Además, el modelo de datos de las asignaturas no utiliza relaciones reales con los profesores, lo que dificulta la implementación de funcionalidades de gestión académica.

## Goals / Non-Goals

**Goals:**
- Unificar la fuente de datos: el frontend debe depender 100% de la API.
- Refactorizar el modelo `Course` para usar una relación real con `Professor`.
- Asegurar que el script de `seed` genere datos coherentes y vinculados entre sí.
- Limpiar el código del frontend de cualquier referencia a datos estáticos de asignaturas o horarios.

**Non-Goals:**
- Implementar login o gestión de perfiles avanzada en este paso.
- Añadir nuevas funcionalidades al calendario (solo corregir los datos).
- Cambiar la base de datos de MongoDB a SQL (a pesar de la presencia de archivos SQL huérfanos).

## Decisions

### 1. Refactorización del Modelo `Course`
- **Decisión**: Cambiar el campo `professor` de `String` a un `ObjectId` referenciando el modelo `Professor`.
- **Racional**: Permite realizar `populate()` en las consultas y asegura que solo profesores reales puedan estar a cargo de asignaturas.
- **Alternativa**: Mantener el nombre como string, pero esto no soluciona el problema de integridad a largo plazo.

### 2. Eliminación Agresiva de Mocks
- **Decisión**: Vaciar los arrays `MOCK_COURSES` y `MOCK_SCHEDULE` en `constants.ts`.
- **Racional**: Obliga a los componentes a manejar el estado de "Cargando" o "Vacío" basándose en datos reales, exponiendo cualquier fallo de la API de forma inmediata.

### 3. Re-inicialización de la DB (Seed)
- **Decisión**: El script `seed.js` primero borrará las colecciones de `Course`, `Schedule` y `Professor` antes de insertar los nuevos datos unificados.
- **Racional**: Garantiza que no queden IDs huérfanos o datos antiguos que confundan al sistema.

## Risks / Trade-offs

- **[Risk]** → El sistema podría verse vacío temporalmente si la conexión a MongoDB falla.
- **[Mitigation]** → Asegurar que el backend maneje errores de conexión con logs claros y que el frontend muestre un estado de error amigable.
- **[Risk]** → Pérdida de datos locales de prueba si no se hace backup.
- **[Mitigation]** → El cambio se centra en un entorno de desarrollo donde el `seed` es la fuente primaria.
