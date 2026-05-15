## Context

La interfaz actual de `MeetView` utiliza un sistema de layout basado en `flex-row` con anchos fijos para la barra lateral (`w-80`) y alturas fijas para los controles (`h-28`). En pantallas de menos de 1280px de ancho o 800px de alto, el área destinada al vídeo se reduce drásticamente, obligando a los controles a quedar fuera del área visible o forzando scroll.

## Goals / Non-Goals

**Goals:**
- Implementar un diseño "Mobile-First" que escale hasta pantallas de escritorio.
- Maximizar el área del vídeo en todo momento.
- Asegurar que los botones de control sean siempre accesibles sin necesidad de scroll o zoom.
- Hacer que la barra lateral sea opcional/colapsable en pantallas pequeñas.

**Non-Goals:**
- No se cambiará la tecnología de videollamada (WebRTC/Socket.io).
- No se rediseñará el estilo visual de los componentes (colores, bordes), solo su disposición y comportamiento responsivo.

## Decisions

### 1. Breakpoints Dinámicos (Tailwind `lg`)
- **Decisión**: Usar el breakpoint `lg` (1024px) como divisor principal. Por debajo de 1024px, la barra lateral se oculta por defecto.
- **Rationale**: Es el estándar para tablets en modo vertical y portátiles pequeños.
- **Alternativa**: Usar `md` (768px), pero en 768px la barra de 320px sigue siendo demasiado invasiva.

### 2. Controles en Overlay Absoluto
- **Decisión**: Cambiar `div className="h-28 ..."` por un contenedor con `absolute bottom-6 left-1/2 -translate-x-1/2`.
- **Rationale**: Al situar los controles sobre el vídeo con un fondo traslúcido (`bg-black/40 backdrop-blur-md`), ganamos 112px de altura real para el stream de vídeo.
- **Alternativa**: Reducir el `h-28` a `h-16`, pero esto sigue quitando espacio y no resuelve el problema en pantallas ultra-pequeñas.

### 3. Chat como Drawer/Overlay
- **Decisión**: En pantallas pequeñas, el `ChatPanel` usará `z-index` superior y cubrirá parte del vídeo en lugar de desplazarlo.
- **Rationale**: El desplazamiento del vídeo (`flex-row`) provoca que el stream cambie de aspect-ratio bruscamente, lo cual es molesto y consume CPU al re-renderizar el canvas de vídeo.

### 4. Toggle State para Sidebar
- **Decisión**: Añadir un estado `isSidebarOpen` que controle la visibilidad de la lista de usuarios.
- **Rationale**: Permite al usuario elegir cuándo quiere ver a los participantes y cuándo prefiere centrarse en la clase.

## Risks / Trade-offs

- **[Riesgo]** Los controles flotantes pueden tapar subtítulos o información importante en la parte inferior del vídeo. → **Mitigación**: Implementar una lógica de auto-ocultación de controles tras 3 segundos de inactividad del ratón.
- **[Riesgo]** Superposición del Chat y la lista de participantes en móviles. → **Mitigación**: Cerrar automáticamente uno al abrir el otro en pantallas menores a 768px.
- **[Trade-off]** Al ocultar la sidebar por defecto, el usuario puede no saber cómo llamar a otros. → **Mitigación**: Mantener un botón de "Participantes" visible en la barra de controles flotante.
