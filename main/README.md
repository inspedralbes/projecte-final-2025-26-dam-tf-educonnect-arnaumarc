# EduConnect Suite

Aquest document detalla un repàs complet a les funcionalitats del projecte EduConnect, així com l'stack de tecnologies emprades per crear-lo, l'ús que se'ls ha donat dins de cada mòdul i la raó de la seva implementació.

---

## Funcionalitats Principals del Projissenyat com a una solució integral 360º de connectivitat educativa. Les principals característiques que defineixen l'aplicació són:

1. **Gestió Autenticada i Rols**: Diferenciació clara entre les funcionalitats a les quals tenen accés els professors respecte als alumnes. Permet gestionar perfils de forma segura i eficient.
2. **Sistema Multiplataforma Integrat**: Un mateix nucli que dóna servei a una plataforma Web, una aplicació per a mòbils Android i iOS, i un Bot per a Discord, assegurant que la comunitat educativa sempre estigui connectada per la via que li sigui més còmoda.
3. **Sincronització i Comunicació Temps Real**: Utilització de tecnologia de WebSockets per transmetre notificacions, alertes i canvis en temps real (sense necessitat de refrescar la pantalla) entre aplicacions i servidors.
4. **Alerta Omnicanal amb Discord**: Enviament i gestió d'avisos acadèmics que poden arribar directament als canals de xat de Discord dels alumnes, on ja passen gran part del seu temps, afavorint el fet que cap notificació important passi per alt.

---

## 🛠 Tecnologies Utilitzades, Usos i Raons d'Implementació

El projecte s'ha dissenyat basant-se en una arquitectura modular separada en 4 catàlegs principals (`backend`, `frontend`, `expo-mobile` i `bot-discord`).  A continuació es desglossa l'stack tecnològic:

### 1. El Backend (`/backend`)
Responsable de la lògica de negoci, la manipulació de bases de dades i de mantenir a tothom sincronitzat.

- **Node.js**: Entorn d'execució de JavaScript al cantó del servidor.
  - *Per què?* Ens permet un desenvolupament asíncron i altament concurrent, ideal per a tractar amb sockets i xarxes d'informació, a més de poder fer servir el mateix llenguatge (JS/TypeScript) i lògica al backend i al frontend.
- **Express**: Framework minimalista basat en Node.js per construir APIs RESTful.
  - *Per què?* Agilitza radicalment l'entintat i el control de les rutes (endpoints), els accessos i la recepció/enviament de JSONs.
- **Mongoose**: Llibreria d'esquemes per a treballar amb *MongoDB* amb un paradigma orientat a objectes.
  - *Per què?* Ens permet dissenyar Bases de Dades NoSQL flexibles, amb un fort modelatge de dades i relacions naturals entre documents, perfecte per a estructures no sempre rígides com és la informació educacional.
- **Socket.io**: Llibreria universal de comunicació web.
  - *Per què?* Facilita i estableix túnels de comunicació bidireccional directa amb els usuaris webs i natius, vital per poder llançar un avis urgent sense retards innecessaris.

### 2. Frontend Web (`/frontend`)
Portal web d'accés i gestió ràpida, pensat molt per a administració o tasques d'escriptori.

- **React**: Llibreria central per al desenvolupament d'interfícies gràfiques (UI).
  - *Per què?* Ofereix un enfocament pur basat en "components" tancats i autogestionats, fent les interfícies hiper-reactives i reusables.
- **Vite**: Constructor web i servidor local (Bundler).
  - *Per què?* Substitueix eines més dures com Create React App. Proporciona una recàrrega de mòduls en calent (HMR) fulminantment ràpida; redueix molt els temps d'espera programant frontends.
- **Lucide-React** i **React-Hot-Toast**: Iconografia i llançament de finestres emergents visuals.
  - *Per què?* Estilitzen l'aplicació i afegeixen qualitat premium amb sistemes de *feedback* atractius i intuïtius pel ciutadà. Es busca trencar la monotonia de portals educatius avorrits.

### 3. Aplicació Mòbil (`/expo-mobile`)
L'opció de butxaca d'EduConnect.

- **React Native**: Entorn de desenvolupament mobile.
  - *Per què?* Aprofita tot el coneixement tècnic del `Frontend` (React) però convertint a la fi el codi cap a components purament natius en l'smartphone, mantenint alts estàndards de fluiditat a iOS i Android.
- **Expo**: Framework open-source creat al voltant de React Native.
  - *Per què?* Permet posar en marxa aplicacions nacionals sense complicacions complexes amb Android Studio o Xcode des del primer minut, i facilita l'accés a APIs natives dels terminals (com càmeres, wifi o xarxes enrutament).

### 4. Gestor de Discord (`/bot-discord`)
Un simple i discret programa independent enllaçat amb el botó a les comunitats d'alumnes.

- **Discord.js**: El paquet i mòdul oficial més usat en interfícies de bots de Discord utilitzant Node.
  - *Per què?* És l'opció per defecte de qualitat que la plataforma (Discord) ens ofereix per, amb un parell de tokens oficials, manipular rols, xats d'estudiants o canals de continguts a plaer sense sortir del propi backend de l'aplicació. Ajuda a l'alumnat que passa molt de temps jugant o usant el Discord connectat estigui informat i actualitzat de tot moment en les assignatures.
