# H — Presentació Tècnica (EduConnect)

Aquest document detalla l'arquitectura, les decisions tecnològiques i la resolució de reptes del projecte **EduConnect**. Està estructurat com a guió per a la presentació final.

---

## Diapositiva 1: Portada Tècnica
*   **Títol:** EduConnect: Arquitectura i Desenvolupament.
*   **Objectiu:** Demostrar la robustesa de la solució des del vessant de l'enginyeria de programari.
*   **Autors:** Arnau Perera Ganuza i Marc Cara Montes.

---

## Diapositiva 2: Stack Tecnològic i Justificació
*   **Frontend:** React con TypeScript per garantir la seguretat de tipus i la mantenibilitat.
*   **Backend:** Node.js amb Express per la seva eficiència en la gestió d'I/O asíncrona.
*   **Temps Real:** Socket.io per a la bidireccionalitat instantània (notificacions i feed).
*   **Persistència:** MongoDB (NoSQL) per a la flexibilitat dels temaris i notificacions, complementat amb SQL per a operacions estructurades.

---

## Diapositiva 3: Arquitectura i Flux de Dades
*   **Modularitat:** Separació clara entre el nucli de l'API i el sistema de senyalització per a videollamades.
*   **Comunicació:** 
    *   API RESTful per a la persistència de dades.
    *   WebSockets per a la reactivitat de la interfície.
    *   WebRTC (Peer-to-Peer) per al mòdul de Meet.

---

## Diapositiva 4: Evolució per Sprints
*   **S1-S2: MVP Core**: Fonaments de l'API, JWT Auth i calendari inicial.
*   **S3-S4: Funcionalitat Avançada**: Gestió de recursos multimèdia, horaris dinàmics amb Drag & Drop i integració de Meet.
*   **S5: Consolidació i QA**: Refactorització del sistema de notificacions i implementació de capes de seguretat (Fail2Ban).

---

## Diapositiva 5: Reptes Tècnics I: Temps Real i Notificacions
*   **El Problema:** Sincronització de l'estat global sense refrescar la pàgina (notificacions "fantasma").
*   **La Solució:** Implementació d'un sistema basat en **Socket.io** que emet esdeveniments globalment. El `NotificationBot` i el `TablonView` consumeixen aquests esdeveniments mitjançant un `SocketContext` reactiu.
![EduBot Reactivitat](../img/manual/02-dashboard-alumne.png)
*   **Resultat:** Latència mínima en la recepció d'avisos crítics.

---

## Diapositiva 6: Reptes Tècnics II: Gestió de Col·lisions
*   **El Problema:** Superposició horària no detectada en l'assignació de classes i aules.
*   **La Solució:** Desenvolupament d'una lògica de validació al backend (`scheduleController.js`) que verifica interseccions en els intervals de temps abans de permetre l'escriptura a la base de dades.
![Editor d'Horaris](../img/manual/05-editor-horaris.png)
*   **Interfície:** Ús de la graella horària (Hourly Grid) per facilitar la visió espacial del professor.

---

## Diapositiva 7: Infraestructura i Seguretat (DevOps)
*   **Contenidorització:** Ús de **Docker** per a un desplegament aïllat i reproduïble.
*   **Seguretat Activa:** Implementació de **Fail2Ban** per protegir el backend contra atacs de força bruta.
*   **Reverse Proxy:** Configuració de **Caddy** per a la gestió automàtica de certificats HTTPS (SSL/TLS).

---

## Diapositiva 8: Conclusions i Futur Tècnic
*   **Robustesa:** El sistema ha demostrat estabilitat sota càrrega simulada i condicions de latència variables.
*   **Mantenibilitat:** El codi segueix patrons de disseny modulars que permeten l'escalabilitat (Mòdul de qualificacions, IA).
*   **Requisits:** Node.js 18+, MongoDB 6+, Navegador amb suport WebRTC.

---
*EduConnect: Desenvolupat amb passió per millorar l'experiència acadèmica.*
