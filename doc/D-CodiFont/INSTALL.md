# Guia d’instal·lació i desplegament: EduConnect

Aquesta guia detalla com instal·lar i executar els mòduls del projecte EduConnect en desenvolupament i en producció amb domini.

## Requisits previs
- Node.js (18+)
- npm
- Docker + Docker Compose (recomanat per producció)
- MongoDB (si no uses Docker)
- Expo Go / EAS (si vols provar o compilar l’app mòbil)

---

## 1) Instal·lació (dev)

```bash
cd main
node setup.js
```

Alternativa:

```bash
cd main
npm run install-all
```

---

## 2) Execució (dev)

- Backend (API + sockets):
  - Docker: `cd main/backend && docker-compose up --build`
  - Node: `cd main/backend && npm run dev`

- Frontend (web):
  - `cd main/frontend && npm run dev`

- Mobile (Expo):
  - `cd main/expo-mobile && npx expo start`

---

## 3) Producció amb domini `https://projecteeduconnect.cat`

### Web + API sota el mateix domini (recomanat)
- El frontend usa **same-origin** i crida l’API a `/api/...`.
- El reverse proxy (Caddy) redirigeix `/api`, `/socket.io` i `/uploads` cap al backend.

### Fitxers clau
- `main/frontend/config.ts`: en producció usa `window.location.origin`.
- `main/backend/Caddyfile`: domini i reverse proxy.
- `main/backend/src/index.js`: CORS configurable via `CORS_ORIGINS`.

### Variables d’entorn (backend)
- `NODE_ENV=production`
- Opcional: `CORS_ORIGINS=https://projecteeduconnect.cat`

### Variables d’entorn (Expo)
- `EXPO_PUBLIC_API_BASE_URL=https://projecteeduconnect.cat`

---

## Notes
- Els fitxers de vídeo i PDFs d’entrega són a `doc/`.
