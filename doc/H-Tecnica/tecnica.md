# H — Presentació tècnica

Aquest document detalla el desenvolupament tècnic d'EduConnect, des de la seva concepció fins a la seva implementació final, destacant els reptes superats i les decisions arquitectòniques.

## Evolució de funcionalitats per Sprints

L'evolució del projecte ha seguit un creixement orgànic basat en la retroalimentació constant:

- **Sprint 1: Fonaments**: Establiment de la comunicació básica i calendari d'exàmens.
- **Sprint 2: Intel·ligència i Automatització**: Introducció de l'EduBot i sistema d'alertes automàtiques per a professors i alumnes.
- **Sprint 3: Gestió de Continguts**: Implementació del sistema de temaris (Moodle-like) amb suport per a fitxers i URLs.
- **Sprint 4: Comunicació Real-Time**: Desenvolupament del mòdul de Meet per a videollamades i millora del perfil d'usuari amb gestió d'avatars.
- **Sprint 5: Robustesa**: Refactorització del sistema de notificacions per suportar agrupament intel·ligent i implementació de mesures de seguretat com Fail2Ban al backend.

## Problemes i solucions

1.  **Sincronització de Notificacions**:
    - *Problema*: Les notificacions no s'actualitzaven en temps real si l'usuari no refrescava la pàgina.
    - *Solució*: Implementació d'un sistema basat en **Socket.io** que emet esdeveniments globalment, permetent que el `NotificationBot` i el `TablonView` s'actualitzin a l'instante.
2.  **Gestió de Col·lisions a l'Horari**:
    - *Problema*: Els professors podien assignar classes en hores on ja n'hi havia d'altres.
    - *Solució*: Desenvolupament d'una lògica de validació al backend (`scheduleController.js`) que verifica la disponibilitat abans de desar qualsevol canvi.
3.  **Complexitat de la Videollamada**:
    - *Problema*: Implementar una solució de vídeo des de zero és complex per a entorns de producció.
    - *Solució*: Ús de **WebRTC** per a la comunicació Peer-to-Peer, utilitzant el nostre propi servidor de sockets com a mecanisme de *signaling*.

## Aspectes tècnics i decisions

- **Arquitectura**: Arquitectura de tres capes clarament separada. El backend actua com a cervell central centralitzant la veritat de les dades, mentre que el bot i el frontend són consumidors proactius.
- **Decisions Tècniques**:
    - **React (Frontend)**: Per la seva capacitat de gestionar estats complexos de la UI de forma eficient.
    - **MongoDB (NoSQL)**: Ideal per a l'estructura de temaris i notificacions, que pot variar en complexitat sense requerir migracions de schema rígides.
    - **Decision Estratègica**: Enfocament en una plataforma Web-First que prioritza l'estabilitat i la facilitat d'ús.
- **Requisits Tècnics**:
    - Node.js > 18.x
    - MongoDB instància activa.
    - Navegadors moderns amb suport per a WebRTC i ES6+.

---
*EduConnect: Desenvolupat amb passió per millorar l'experiència acadèmica.*
