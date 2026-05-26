# EduConnect Suite

Aquest document detalla un repàs complet a les funcionalitats del projecte EduConnect, així com l'stack de tecnologies emprades per crear-lo, l'ús que se'ls ha donat dins de cada mòdul i la raó de la seva implementació.

---

## Funcionalitats Principals del Projecte

EduConnect s'ha dissenyat com a una solució integral de connectivitat educativa centrada en la web. Les principals característiques que defineixen l'aplicació són:

1. **Gestió Autenticada i Rols**: Diferenciació clara entre les funcionalitats a les quals tenen accés els professors respecte als alumnes. Permet gestionar perfils de forma segura i eficient.
2. **Plataforma Web Unificada**: Un mateix nucli que dóna servei a professors i alumnes, accessible des de qualsevol navegador modern, assegurant que la comunitat educativa sempre estigui connectada.
3. **Sincronització i Comunicació Temps Real**: Utilització de tecnologia de WebSockets per transmetre notificacions, alertes i canvis en temps real (sense necessitat de refrescar la pantalla) entre usuaris i servidors.
4. **Gestió de Continguts i Horaris**: Sistema flexible per a la pujada de recursos educatius i la gestió dinàmica del calendari acadèmic.

---

## 🛠 Tecnologies Utilitzades, Usos i Raons d'Implementació

El projecte s'ha dissenyat basant-se en una arquitectura modular separada en 2 catàlegs principals (`backend` i `frontend`). A continuació es desglossa l'stack tecnològic:

### 1. El Backend (`/backend`)
Responsable de la lògica de negoci, la manipulació de bases de dades i de mantenir a tothom sincronitzat.

- **Node.js**: Entorn d'execució de JavaScript al cantó del servidor.
  - *Per què?* Ens permet un desenvolupament asíncron i altament concurrent, ideal per a tractar amb sockets i xarxes d'informació.
- **Express**: Framework minimalista basat en Node.js per construir APIs RESTful.
  - *Per què?* Agilitza radicalment l'entintat i el control de les rutes (endpoints), els accessos i la recepció/enviament de JSONs.
- **Mongoose**: Llibreria d'esquemes per a treballar amb *MongoDB* amb un paradigma orientat a objectes.
  - *Per què?* Ens permet dissenyar Bases de Dades NoSQL flexibles, amb un fort modelatge de dades i relacions naturals entre documents.
- **Socket.io**: Llibreria universal de comunicació web.
  - *Per què?* Facilita i estableix túnels de comunicació bidireccional directa amb els usuaris webs, vital per poder llançar un avis urgent sense retards innecessaris.

### 2. Frontend Web (`/frontend`)
Portal web d'accés i gestió ràpida, pensat per a l'administració acadèmica i la interacció diària.

- **React**: Llibreria central per al desenvolupament d'interfícies gràfiques (UI).
  - *Per què?* Ofereix un enfocament pur basat en "components" tancats i autogestionats, fent les interfícies hiper-reactives i reusables.
- **Vite**: Constructor web i servidor local (Bundler).
  - *Per què?* Proporciona una recàrrega de mòduls en calent (HMR) fulminantment ràpida; redueix molt els temps d'espera programant frontends.
- **Lucide-React** i **React-Hot-Toast**: Iconografia i llançament de finestres emergents visuals.
  - *Per què?* Estilitzen l'aplicació i afegeixen qualitat premium amb sistemes de *feedback* atractius i intuïtius pel ciutadà.
