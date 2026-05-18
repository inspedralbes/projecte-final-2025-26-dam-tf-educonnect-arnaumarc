# Tasques pendents (entrega) — EduConnect

Basat en l’estat actual del repositori i els requisits A–J, aquestes són les tasques que (probablement) falten o estan a mig fer.

## Prioritat 0 — Requisits mínims a `doc/` (fitxers finals)

- [ ] **Substituir placeholders** pels fitxers finals (amb contingut real) a l’arrel de `doc/`:
  - [ ] `doc/comercial_2425_EduConnect.pdf` (ara sembla placeholder)
  - [ ] `doc/tecnica_2425_EduConnect.pdf` (ara sembla placeholder)
  - [ ] `doc/resum_2425_EduConnect.pdf` (ara sembla placeholder)
  - [ ] `doc/demo_2425_EduConnect.mp4` (ara sembla placeholder)
  - [ ] `doc/pitch_2425_EduConnect.mp4` (ara sembla placeholder)
- [ ] Verificar que **es poden obrir amb VLC** (MP4) i amb qualsevol lector PDF, i que el pes/durada són coherents.
- [ ] Verificar que el **pitch dura exactament 1:00** (ni més ni menys).

## Prioritat 1 — Presentació i qualitat (format i “bona presentació”)

- [ ] Corregir **encoding (UTF-8)** en documents que mostren caràcters tipus `Ã³`, `Ã¨`, etc. (s’ha detectat a `doc/PLANIFICACIO.md`, `doc/MANUAL.md`, `doc/C-Disseny/*.md`).
- [ ] Revisar coherència de **noms i rols** (integrants, responsables, curs/cicle, etc.) a tots els documents.
- [ ] Afegir/organitzar una carpeta d’**assets** (logos, captures) per reutilitzar en PDFs/presentacions (p. ex. `doc/assets/` i/o `doc/A-Resum/assets/`).

## A — Presentació Resum (PDF) (`resum_2425_EduConnect.pdf`)

Font actual: `doc/A-Resum/resum.md` (té diversos TODO).

- [ ] Diapo 1: completar frase descriptiva, curs/cicle, i afegir logo escola.
- [ ] Diapo 2: afegir **captura significativa** del projecte.
- [ ] Diapo 3: escriure **abstract** (màx. 10 línies).
- [ ] Diapo 4: afegir **logos tecnologies** (web, mòbil, backend, BD, discord, etc.).
- [ ] Afegir 4–8 captures d’ús de l’app (flux principal) amb peu de foto.
- [ ] Generar el PDF final i substituir `doc/resum_2425_EduConnect.pdf`.

## B — Planificació (`doc/PLANIFICACIO.md`)

Ja existeix i té contingut, però cal revisió de qualitat.

- [ ] Corregir encoding a UTF-8 (actualment es veu “PlanificaciÃ³”, etc.).
- [ ] Validar que hi ha **enumeració de sprints** (incloent fase MVP) i **llistat de tasques i persones** per sprint (que sigui realista i coherent).
- [ ] Confirmar/afegir **testing d’usuari** (si es va fer) amb dates, participants i resultats.
- [ ] Afegir enllaços (si aplica) a issues/PRs o a OpenSpec perquè es pugui traçar.

## C — Disseny (al Git) (`doc/C-Disseny/`)

Hi ha fitxers: `Screen-Flow.md`, `ER-Diagram.md`, `Class-Diagram.md`, `Activity-Diagram.md`.

- [ ] Corregir encoding a UTF-8 en els documents.
- [ ] Verificar que el **flux de pantalles** cobreix tot el recorregut i coincideix amb l’app real.
- [ ] Verificar que els diagrames (UML/E-R) són **coherents amb el codi** actual (models, relacions, endpoints, etc.).
- [ ] (Opcional) Exportar diagrames a imatge/PDF si el tribunal no renderitza Mermaid.

## D — Codi font + instal·lació/desplegament (al Git)

Hi ha guia: `doc/D-CodiFont/INSTALL.md` i el codi a `main/`.

- [ ] Verificar que `doc/D-CodiFont/INSTALL.md` permet muntar el projecte des de zero (dev i prod).
- [ ] Afegir `*.env.example` (si no existeix) per backend/frontend/mobile/bot i documentar-lo.
- [ ] Documentar instal·ladors/compilació:
  - [ ] Web (build + deploy)
  - [ ] Backend (docker-compose/pm2/etc.)
  - [ ] Mobile (EAS build / APK / instal·lació)
  - [ ] Bot (execució i permisos)
- [ ] Revisar que el repo conté tot el necessari per desplegar (scripts, Caddyfile, etc.) i que està referenciat.

## E — Documentació tècnica (punt d’entrada) (`doc/E-Documentacio-Tecnica/README.md`)

Actualment conté molts TODO.

- [ ] Completar “Configuració (env)” (BD, secrets, ports, variables).
- [ ] Escriure l’**arquitectura** (auth/rols, realtime socket.io, notificacions omnicanal).
- [ ] Documentar l’API: endpoints clau + exemples request/response.
- [ ] Indicar “on tocar codi primer”: fitxers d’entrada reals per:
  - [ ] backend
  - [ ] frontend
  - [ ] mobile
  - [ ] bot
- [ ] (Si és possible) Generar docs automàtiques (Swagger/OpenAPI, etc.) i enllaçar-les des d’aquí i des del `README.md` arrel.

## F — Presentació funcional/comercial (PDF) (`comercial_2425_EduConnect.pdf`)

Font actual: `doc/F-Comercial/comercial.md` (quasi tot és TODO).

- [ ] Definir objectius i abast (incloent “fora d’abast”).
- [ ] Llistar funcionalitats (per rol/plataforma) amb captures.
- [ ] Estudi de competència (alternatives i comparativa).
- [ ] Costos/requeriments: mà d’obra, infra, manteniment, costos inicials.
- [ ] Roadmap i proposta de valor.
- [ ] Generar el PDF final i substituir `doc/comercial_2425_EduConnect.pdf`.

## G — Demo (vídeo) (`demo_2425_EduConnect.mp4`)

Guia: `doc/G-Demo/README.md`.

- [ ] Gravar demo completa (login → dashboard → horaris → recursos → notificacions → discord → mòbil).
- [ ] Verificar àudio/qualitat i que s’entén sense context.
- [ ] Exportar a MP4 i substituir `doc/demo_2425_EduConnect.mp4`.

## H — Presentació tècnica (PDF) (`tecnica_2425_EduConnect.pdf`)

Font actual: `doc/H-Tecnica/tecnica.md` (té TODO).

- [ ] Omplir evolució per sprints (coherent amb `doc/PLANIFICACIO.md`).
- [ ] Documentar problemes reals trobats i solucions (incidències tècniques).
- [ ] Explicar decisions tècniques, requisits i arquitectura (amb diagrames/captures si cal).
- [ ] Generar el PDF final i substituir `doc/tecnica_2425_EduConnect.pdf`.

## I — Manual d’usuari (`doc/MANUAL.md`)

Té contingut, però cal revisió de qualitat.

- [ ] Corregir encoding a UTF-8 (actualment es veu “AcadÃ¨mica”, etc.).
- [ ] Afegir captures reals (pas a pas) i rutes exactes de navegació.
- [ ] Separar instruccions per rol (alumne/professor) i per plataforma (web/mòbil).
- [ ] Afegir secció de FAQ i resolució de problemes comuns (login, notificacions, permisos, etc.).

## J — Pitch (1 minut) (`pitch_2425_EduConnect.mp4`)

Guia: `doc/J-Pitch/README.md`.

- [ ] Escriure guió de 60s (cronometra’l).
- [ ] Preparar visuals (pantalles + títols + problema/solució/diferenciadors).
- [ ] Gravar/editar i exportar a MP4.
- [ ] Verificar durada exacta 1:00 i substituir `doc/pitch_2425_EduConnect.mp4`.

## Checklist final (abans d’entregar)

- [ ] `doc/README.md` reflecteix l’estat real (sense “TODO” crítics).
- [ ] Tots els PDFs tenen portada, índex si cal, i són llegibles.
- [ ] Vídeos: funcionen a VLC, sense dependències, i amb noms exactes.
- [ ] No hi ha caràcters corruptes (encoding) a la documentació.
- [ ] El `README.md` de l’arrel apunta correctament a la documentació tècnica (E) i a la guia d’instal·lació (D).

