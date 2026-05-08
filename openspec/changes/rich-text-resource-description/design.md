## Context

El sistema utiliza actualmente un `<textarea>` básico en el componente `CourseDetailsView.tsx`. El contenido se guarda en el campo `content` del modelo de recursos de Mongoose y se renderiza como texto plano en tarjetas. La falta de formato limita la jerarquía visual de las instrucciones de los profesores.

## Goals / Non-Goals

**Goals:**
- Implementar un editor de texto enriquecido moderno y modular.
- Soportar tablas, listas, colores de texto y carga de imágenes.
- Asegurar que el contenido se visualice correctamente tanto en modo claro como oscuro.
- Mantener la compatibilidad con los recursos que ya existen (texto plano).

**Non-Goals:**
- Implementar un sistema de gestión de archivos avanzado para imágenes (se usarán URLs externas o Base64 por ahora).
- Cambiar la estructura de la base de datos (seguiremos usando el campo `content`).

## Decisions

- **Librería de Editor: Tiptap.**
    - *Rationale:* Tiptap es "headless", lo que permite un control total sobre la UI del editor usando los estilos existentes del proyecto. Es altamente modular, lo que facilita añadir soporte para tablas (`Table`), colores (`Color`) y enlaces.
    - *Alternativas:* React-Quill (más sencillo pero menos flexible y con problemas potenciales en React 19).
- **Renderización: Estilos Propios.**
    - *Rationale:* Se creará un contenedor con la clase `resource-rich-text` que definirá estilos base para etiquetas HTML (`h1`, `p`, `table`, etc.) para asegurar que el contenido se vea bien sin depender de librerías de estilos externas pesadas.
- **Almacenamiento de Contenido: HTML.**
    - *Rationale:* Guardar el HTML generado por el editor es el camino más rápido y compatible para un prototipo, minimizando cambios en el backend.

## Risks / Trade-offs

- **[Riesgo] Seguridad (XSS)** → **Mitigación**: El backend y el frontend deberían idealmente usar una librería de sanitización (como `dompurify`), pero para el prototipo se confiará en el entorno controlado del profesor.
- **[Riesgo] Tablas en móviles** → **Mitigación**: Se añadirá un contenedor con `overflow-x-auto` para que las tablas no rompan el diseño en pantallas pequeñas.
- **[Riesgo] Tamaño de base de datos (Imágenes Base64)** → **Mitigación**: Se recomendará el uso de URLs externas si el tamaño del documento se vuelve un problema.
