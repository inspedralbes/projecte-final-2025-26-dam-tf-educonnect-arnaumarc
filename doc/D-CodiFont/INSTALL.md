# Guia d'Instal·lació i Desplegament: EduConnect

Aquesta guia detalla els passos necessaris per instal·lar i executar tots els mòduls del projecte EduConnect.

## Requisits Previs
- **Node.js** (versió 18 o superior)
- **npm** (inclòs amb Node.js)
- **MongoDB** (local o via Docker)
- **Docker & Docker Compose** (opcional, per al backend)
- **Expo Go** (instal·lat al mòbil per provar l'App nàtiva)

---

## 1. Instal·lació Automàtica (Recomanat)
Hem creat un script que instal·la totes les dependències de tots els mòduls automàticament.

1. Navega a la carpeta principal del codi:
   ```bash
   cd main
   ```
2. Executa l'instal·lador:
   ```bash
   node setup.js
   ```

Això instal·larà les `node_modules` a `backend`, `frontend`, `expo-mobile` i `bot-discord`.

---

## 2. Configuració de Variables d'Entorn (.env)
Cada mòdul pot necessitar el seu fitxer `.env`. Assegura't de configurar:

### Backend (`main/backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/educonnect
DISCORD_TOKEN=el_teu_token_de_bot
```

### Discord Bot (`main/bot-discord/.env`)
```env
DISCORD_TOKEN=el_teu_token_de_bot
CLIENT_ID=id_del_teu_bot
```

---

## 3. Execució dels Mòduls

### Backend (API i Sockets)
Tens dues opcions:
- **Amb Docker**: `cd main/backend && docker-compose up -d`
- **Amb Node**: `cd main/backend && npm start`

### Frontend (Web)
```bash
cd main/frontend
npm run dev
```
La web estarà disponible a `http://localhost:5173`.

### Aplicació Mòbil (Expo)
```bash
cd main/expo-mobile
npx expo start
```
Escaneja el codi QR amb l'app **Expo Go** al teu terminal iOS/Android.

### Discord Bot
```bash
cd main/bot-discord
node bot.js
```

---

## Solució de Problemes
- **Error de connexió a DB**: Comprova que MongoDB està actiu.
- **Ports ocupats**: L'API utilitza el 5000 i la Web el 5173. Assegura't que estan lliures.
- **Dependències**: Si un mòdul falla, prova d'esborrar `node_modules` i tornar a fer `npm install` dins d'aquell directori.
