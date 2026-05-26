# Guia d’instal·lació i desplegament: EduConnect

Aquesta guia detalla com instal·lar i executar els mòduls del projecte EduConnect tant en entorns de desenvolupament com en producció sota un domini real.

## Requisits previs
- **Node.js**: Versió 18 o superior.
- **npm**: Gestor de paquets de Node.
- **MongoDB**: Instància local o en el núvol (Atlas).
- **Docker + Docker Compose**: Recomanat per a l'aïllament del backend i la base de dades.

---

## 1) Configuració de Variables d'Entorn

Abans d'executar res, has de crear els fitxers `.env` basant-te en els exemples:

### Backend (`main/backend/.env`)
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/educonnect
JWT_SECRET=la_teva_clau_secreta
```

---

## 2) Instal·lació i Execució (Desenvolupament)

### Pas ràpid (recomanat)
```bash
cd main
node setup.js
```

### Manualment
1. **Backend**:
   ```bash
   cd main/backend
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd main/frontend
   npm install
   npm run dev
   ```

---

## 3) Desplegament en Producció (`https://projecteeduconnect.cat`)

L'aplicació està dissenyada per funcionar darrere d'un reverse proxy (Caddy recomanat).

### Arquitectura de producció
- El **Frontend** es compila (`npm run build`) i es serveix com a fitxers estàtics.
- El **Backend** corre sota PM2 o Docker i gestiona l'API, WebSockets i fitxers pujats.
- El reverse proxy redirigeix el trànsit:
  - `/api/*` -> Backend
  - `/socket.io/*` -> Backend
  - `/uploads/*` -> Backend
  - `/*` -> Frontend (Index.html)

### Fitxers de configuració clau
- `main/backend/Caddyfile`: Conté la definició del domini i les rutes de proxy.
- `main/backend/docker-compose.yml`: Per aixecar tota la pila (Backend + Mongo + Fail2Ban) fàcilment.

---

## 4) Seguretat i Manteniment
- **Fail2Ban**: S'inclou un contenidor a Docker per protegir l'API contra atacs de força bruta.
- **Logs**: Revisa els logs de Docker o PM2 per a depuració en viu.

---
*Per a qualsevol dubte, consulteu el README principal del projecte.*
