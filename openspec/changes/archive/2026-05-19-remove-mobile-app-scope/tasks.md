## 1. Código y Scripts

- [x] 1.1 Eliminar el directorio `main/expo-mobile` y todo su contenido.
- [x] 1.2 Actualizar `main/package.json` para eliminar `expo-mobile` de los scripts `install-all` y `start-all`.
- [x] 1.3 Verificar que `npm run install-all` (desde `main/`) funciona correctamente sin intentar entrar en `expo-mobile`.

## 2. Documentación Técnica y de Usuario

- [x] 2.1 Editar `doc/INSTALL.md` para eliminar la sección "Mobile (Expo)" y las variables de entorno relacionadas.
- [x] 2.2 Editar `doc/MANUAL.md` para eliminar menciones a la descarga de la app móvil y notificaciones push nativas.
- [x] 2.3 Actualizar `doc/C-Disseny/Activity-Diagram.md` para eliminar el nodo `Mobile App: View Update`.
- [x] 2.4 Limpiar `doc/E-Documentacio-Tecnica/README.md` eliminando la referencia a `main/expo-mobile`.
- [x] 2.5 Editar `doc/TASQUES-PENDENTS-ENTREGA.md` para eliminar tareas de "Mobile (EAS build / APK)".

## 3. Herramientas y Consistencia

- [x] 3.1 Modificar `doc/tools/generate-required-assets.mjs` para eliminar las referencias a "Mobile: Expo" en la generación de documentos.
- [x] 3.2 Realizar una búsqueda global (grep) de "expo" y "mobile" en el directorio `doc/` para asegurar que no queden referencias perdidas.
- [x] 3.3 Verificar que el frontend web sigue siendo responsivo en tamaños de pantalla pequeños.
