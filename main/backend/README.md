# Backend (server)

## Domini
- Producció: `https://projecteeduconnect.cat`

## CORS (producció)
- Per defecte (NODE_ENV=production) només s’accepta l’origen `https://projecteeduconnect.cat`.
- Per permetre més orígens, defineix `ALLOWED_ORIGINS` (o `CORS_ORIGINS` per compatibilitat), separat per comes, per exemple:
  - `ALLOWED_ORIGINS=https://projecteeduconnect.cat,http://localhost:3000`

## Desplegament (SSH)
1. Copia el projecte al servidor.
2. Configura DNS del domini perquè apunti a la IP del servidor.
3. A `main/backend/` executa `docker-compose up -d --build`.

> El `Caddyfile` serveix el frontend (muntat a `/srv`) i fa reverse proxy del backend a `/api`, `/socket.io` i `/uploads`.
