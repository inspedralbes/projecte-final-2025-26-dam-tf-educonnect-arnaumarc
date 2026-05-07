## Context

Persiste el error donde el profesor Xavier no puede visualizar sus asignaturas en el dashboard, a pesar de estar correctamente vinculadas en la base de datos. Además, el sistema recrea sesiones de horario de prueba en cada reinicio, lo que confunde al usuario que desea gestionar su propio horario desde cero.

## Goals / Non-Goals

**Goals:**
- Asegurar que el filtrado de cursos sea insensible a tipos de datos (normalizar IDs a String).
- Garantizar que el horario inicie completamente vacío tras el seed.
- Corregir el paso de parámetros en `App.tsx` para evitar que `user` sea nulo en casos de navegación por defecto.
- Añadir logs de depuración para identificar discrepancias de ID entre `user` y `course.professor`.

**Non-Goals:**
- No se modificará la estructura de las colecciones.
- No se cambiará la lógica de autenticación (login/password).

## Decisions

### 1. Limpieza de Horarios en Seed
- **Decisión**: Eliminar el bloque de creación de `Schedule` en `seed.js`.
- **Razón**: El usuario ha solicitado explícitamente "quitar las horas ya puestas". Mantendremos la limpieza de la colección pero sin re-población.

### 2. Normalización de IDs en el Filtrado
- **Decisión**: Usar `.toString()` en ambas partes de la comparación en `TeacherDashboardView.tsx`.
- **Razón**: En JavaScript, un `ObjectId` de Mongoose puede no ser estrictamente igual (`===`) a un `string`, aunque sus valores coincidan. La normalización a string previene este fallo común.

### 3. Debugging Proactivo
- **Decisión**: Añadir `console.log` detallados que muestren el `user._id` y el `c.professor._id` de los cursos recibidos.
- **Razón**: Permite confirmar visualmente en la consola del navegador si hay algún ID inesperado (ej. un ID de prueba antiguo que no se borró).

## Risks / Trade-offs

- **[Riesgo]** → Al vaciar el horario, los usuarios de prueba se quedan sin datos iniciales.
  - **Mitigación** → Esto es lo que el usuario ha pedido para poder probar la herramienta de gestión desde cero.
