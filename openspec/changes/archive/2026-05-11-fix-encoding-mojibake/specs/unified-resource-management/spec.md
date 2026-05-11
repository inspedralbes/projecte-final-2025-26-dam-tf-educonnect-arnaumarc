## Purpose
Define la estructura y gestión multimodal de los recursos educativos dentro de las asignaturas, permitiendo una organización clara y accesible de materiales y tareas.

## ADDED Requirements

### Requirement: Resource UI Visual Integrity
La interfaz de gestión de recursos SHALL presentar etiquetas y controles con ortografía correcta en español, eliminando cualquier error de codificación heredado en títulos de modales, etiquetas de campos y botones de acción.

#### Scenario: Viewing resource management modals
- **WHEN** un profesor abre los modales de "Añadir Tema" o "Añadir Recurso"
- **THEN** todas las etiquetas de los campos (ej. "Título", "Descripción") deben mostrarse con las tildes correctas y sin caracteres extraños.
