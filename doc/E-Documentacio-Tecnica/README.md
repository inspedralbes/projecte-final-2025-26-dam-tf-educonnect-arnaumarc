# E — Documentació tècnica (punt d’entrada)

Aquest document serveix com a guia per a desenvolupadors i tècnics que vulguin comprendre el funcionament intern d'EduConnect, la seva arquitectura i com estendre les seves funcionalitats.

## 1) Estructura del repositori
El projecte està dividit en dos components principals:
- `main/backend`: Servidor API REST i WebSocket (Node.js/Express/Socket.io).
- `main/frontend`: Aplicació web (React/TypeScript/Vite).
- `doc/`: Documentació del projecte, diagrames i manuals.

## 2) Com començar (Desenvolupament)
1. Instala les dependències a l'arrel i a cada carpeta:
   ```bash
   npm install
   # També pots usar el script de setup:
   node setup.js
   ```
2. Configura les variables d'entorn (veure secció 3).
3. Executa el projecte en mode desenvolupament:
   ```bash
   npm run start-all
   ```

## 3) Configuració (.env)
El backend requereix un fitxer `.env`. Trobaràs un exemple a `main/backend/.env.example`.

### Variables clau:
- `PORT`: Port on corre el servidor (defecte: 3001).
- `MONGO_URI`: Cadena de connexió a MongoDB.
- `JWT_SECRET`: Clau secreta per a la generació de tokens de sessió.

## 4) Arquitectura i Tecnologies
EduConnect utilitza l'stack **MERN** amb algunes addicions per a temps real:

- **Autenticació i Rols**: Sistema basat en models d'Alumne i Professor diferenciats, amb rutes protegides.
- **Realtime (Socket.io)**: S'utilitza per a:
  - Notificacions instantànies (Toasts).
  - Sincronització del feed d'activitat.
  - Senyalització per a videollamades (WebRTC).
- **Notificacions Internes**: Quan un professor crea un avís, el sistema el propaga via:
  - Base de Dades (Notificació interna).
  - WebSockets (A l'usuari si està online).

## 5) API REST
L'API està organitzada en recursos:
- `/api/auth`: Login i registre d'alumnes/professors.
- `/api/courses`: Gestió d'assignatures i temaris.
- `/api/notifications`: Recuperació i marcatge de notificacions.
- `/api/schedule`: Consulta i edició de l'horari acadèmic.
- `/api/submissions`: Lògica d'entrega de tasques i avaluació.

## 6) On tocar codi primer
- **Backend Entry Point**: `main/backend/src/index.js` (Configuració del servidor i Socket.io).
- **Frontend Entry Point**: `main/frontend/index.tsx` i `main/frontend/App.tsx`.
- **Context de Socket**: `main/frontend/src/context/SocketContext.tsx` (Gestiona tota la comunicació en temps real).

---
*Per a més detalls sobre el disseny de la base de dades, consulteu `doc/C-Disseny/ER-Diagram.md`.*
