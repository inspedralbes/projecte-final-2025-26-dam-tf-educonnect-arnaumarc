# B Planificació

Aquest document detalla l'evolució del projecte **EduConnect**, organitzat en Sprints seguint una metodologia àgil i el marc de treball **OpenSpec** (Specification Driven Development). La planificació s'ha basat en la construcció iterativa de funcionalitats, validant cada etapa abans de passar a la següent.

---

## 1. Cronograma i Metodologia

El projecte s'ha dividit en dues fases principals: la construcció del **Producte Mínim Viable (MVP)** i l'etapa d'**Expansió i Refinament**. Cada Sprint ha tingut una durada aproximada d'una setmana d'intensitat alta, amb entregues funcionals al final de cada cicle.

### Línia Temporal del Projecte (2026)

```text
 Abr                     Maig
  |                       |
  v                       v
 [S1]----[S2]----[S3]----[S4]----[S5]----[S6]
  |       |       |       |       |       |
  |       |       |       |       |       +-- Optimització Multimodal i Temàtica (Actual)
  |       |       |       |       +-- QA, Robustesa i Testing d'Usuari Final
  |       |       |       +-- Identitat Digital i Videoconferència
  |       |       +-- Ecosistema, Continguts i Horaris Dinàmics
  |       +-- Interacció Directa i Automatització
  +-- Infraestructura Core i Comunicació (MVP)
```

---

## 2. Fase MVP: Fonaments d'EduConnect

L'objectiu principal d'aquesta fase va ser establir la comunicació bidireccional essencial entre alumnes i professors, assegurant una base tècnica sòlida.

### SPRINT 1: Infraestructura i Gestió Temporal
**Objectiu:** Implementar els canals bàsics i l'organització del calendari acadèmic inicial.

| ID | Tasca | Descripció Detallada | Responsable |
| :--- | :--- | :--- | :--- |
| T1.1 | **Xat de l'Alumnat** | Sala comuna per a resolució de dubtes en temps real. | Marc Armon |
| T1.2 | **Sistema Notificacions** | Servidor d'alertes automàtiques per a esdeveniments clau. | Marc Armon |
| T1.3 | **Arquitectura Calendari** | Disseny visual del calendari d'exàmens i classes. | Arnau Pericas |
| T1.4 | **Calendari Setmanal** | Implementació de la vista d'agenda per a la gestió diària. | Arnau Pericas |
| T1.5 | **Sync d'Horaris** | Sincronització automàtica d'assignatures i hores de classe. | Arnau Pericas |

### SPRINT 2: Interacció i Automatització
**Objectiu:** Refinar la comunicació i introduir agents d'ajuda (Bots) per millorar el flux d'informació.

| ID | Tasca | Descripció Detallada | Responsable |
| :--- | :--- | :--- | :--- |
| T2.1 | **Xat Privat Prof-Alumne** | Canal segur i directe per a tutories personals. | Marc Armon |
| T2.2 | **Alertes Professorat** | Notificacions instantànies al docent per missatges pendents. | Marc Armon |
| T2.3 | **Bot de Notificacions** | Creació d'un agent automàtic per a avisos del sistema (EduBot). | Marc Armon |
| T2.4 | **Notificacions d'Aula** | Interfície d'avisos segmentats per cada assignatura. | Arnau Pericas |

---

## 3. Fase Post-MVP: Expansió i Millora Continua

Un cop validada la base, ens vam centrar en la integració de recursos, la flexibilitat horària i la identitat digital.

### SPRINT 3: Ecosistema Digital i Continguts
**Objectiu:** Connectar amb eines externes i gestió avançada de fitxers multimèdia.

| ID | Tasca | Descripció Detallada | Responsable |
| :--- | :--- | :--- | :--- |
| T3.1 | **Integració Discord** | Connexió amb servidor extern per a la comunitat escolar. | Arnau Pericas |
| T3.2 | **Gestor de Recursos** | Sistema de pujada de teoria, enllaços (URLs) i multimèdia. | Marc Armon |
| T3.3 | **Horaris Dinàmics** | Eina de modificació d'horaris en temps real amb validació de col·lisions. | Marc Armon |
| T3.4 | **Unificació de Dades** | Centralització de professors (MongoDB IDs) i neteja d'entorn. | Marc Armon |

### SPRINT 4: Identitat i Videoconferència
**Objectiu:** Personalització de l'experiència i eines de vídeo per a reunions virtuals.

| ID | Tasca | Descripció Detallada | Responsable |
| :--- | :--- | :--- | :--- |
| T4.1 | **Perfil d'Usuari** | Gestió d'avatars i dades personals (nom, correu, rol). | Arnau Pericas |
| T4.2 | **Mòdul de Meet** | Integració de videollamades directes des de la plataforma. | Marc Armon |
| T4.3 | **Directori d'Usuaris** | Llistat organitzat i visual de tota la comunitat acadèmica. | Marc Armon |

### SPRINT 5: QA, Robustesa i Polítiques de Centre
**Objectiu:** Validació final, seguretat (Fail2Ban) i correcció d'errors crítics detectats.

| ID | Tasca | Descripció Detallada | Responsable |
| :--- | :--- | :--- | :--- |
| T5.1 | **Fase de Testing Alpha** | Proves de càrrega i funcionalitat interna de l'equip. | Marc Armon |
| T5.2 | **QA Visual i UI/UX** | Poliment de la interfície i correcció de bugs de navegació. | Arnau Pericas |
| T5.3 | **Robust Notifications** | Redisseny del sistema de notificacions per evitar pèrdues de dades. | Marc Armon |
| T5.4 | **Single Classroom Policy** | Implementació de la política d'aula única per coherència dades. | Marc Armon |

---

## 4. Estratègia de Validació i Testing d'Usuari

S'ha implementat un cicle de feedback tancat per assegurar que l'eina és intuïtiva per a usuaris no tècnics, basant-nos en escenaris d'ús reals.

### 4.1. Testing d'Usuari Real (UAT)
Es van realitzar sessions de prova amb usuaris externs per validar la usabilitat:
*   **Escenari d'Alumne**: "Revisar les tasques pendents i descarregar el material de l'assignatura".
    *   *Feedback*: Es va simplificar la vista de 'Asignaturas' per fer els recursos més accessibles.
*   **Escenari de Professor**: "Modificar l'horari de la setmana vinent per un canvi d'aula".
    *   *Feedback*: Es va afegir una graella horària més clara (Hourly Grid) per evitar errors en el drag-and-drop.

### 4.2. Matriu de Validació Tècnica

| Tipus de Test | Freqüència | Descripció |
| :--- | :--- | :--- |
| **Unitari (Backend)** | Continu | Validació de rutes d'API i controladors amb dades reals. |
| **Integració** | Final d'Sprint | Comprovació que el Frontend (React) rep les dades del Backend. |
| **Simulació de Rol** | Setmanal | Marc (Alumne) i Arnau (Professor) intercanvien rols de test. |
| **Seguretat (Fail2Ban)** | Final | Proves d'accés no autoritzat per validar el bloqueig d'IPs. |

---
*Darrera actualització: 08/05/2026 - Document formalitzat per a la presentació del projecte.*
