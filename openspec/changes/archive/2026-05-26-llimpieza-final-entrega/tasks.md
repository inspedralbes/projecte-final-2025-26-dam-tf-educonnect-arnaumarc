## 1. Higiene del Repositorio y Módulos

- [x] 1.1 Eliminar todos los archivos `topics_debug.json` detectados en la raíz y subdirectorios.
- [x] 1.2 Eliminar la carpeta `main/bot-discord/` y todas sus referencias.
- [x] 1.3 Asegurar que los archivos de depuración estén incluidos en el `.gitignore`.

## 2. Limpieza de Pipeline y Construcción

- [x] 2.1 Eliminar `expo-mobile` y `bot-discord` del array de módulos en `main/setup.js`.
- [x] 2.2 Eliminar referencias a Expo y Discord en los scripts de `main/package.json`.
- [x] 2.3 Eliminar los scripts de depuración `main/backend/check.js` y `main/backend/dump.js`.

## 3. Pulido de la Interfaz de Usuario (UI)

- [x] 3.1 Ocultar el botón de "Talleres" en `main/frontend/components/Navbar.tsx` para el rol de alumno.
- [x] 3.2 Asegurar que la pestaña "Centro" en `main/frontend/views/TeacherDashboardView.tsx` tenga un estado elegante si no hay avisos.
- [x] 3.3 Realizar una auditoría rápida de las vistas para ocultar mensajes de "en construcción" en el flujo principal.

## 4. Normalización de Documentación y Encoding

- [x] 4.1 Ejecutar limpieza masiva de mojibake (caracteres corruptos) en la carpeta `doc/` y archivos fuente.
- [x] 4.2 Limpiar "TODOs", placeholders y referencias a la App móvil y Discord en `doc/PLANIFICACIO.md` y `doc/MANUAL.md`.
- [x] 4.3 Actualizar `README.md` (raíz) y `doc/README.md` para reflejar el alcance Web exclusivamente.
- [x] 4.4 Simplificar `doc/D-CodiFont/INSTALL.md` eliminando los pasos de instalación de Expo y Discord.
- [x] 4.5 Revisar y limpiar `doc/E-Documentacio-Tecnica/README.md` de secciones vacías.

## 5. Validación Final

- [x] 5.1 Verificar que `npm run build` en el frontend se completa sin errores tras los cambios.
- [x] 5.2 Confirmar que `node main/setup.js` instala correctamente las dependencias de los módulos activos.
- [x] 5.3 Comprobar que no quedan referencias "vivas" al bot de Discord en el código del servidor.
