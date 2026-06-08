# Tasques pendents (entrega) — EduConnect

Basat en l’estat actual del repositori i els requisits A–J, aquestes són les tasques que (probablemente) falten o estan a mig fer.

## Prioritat 0 — Requisits mínims a `doc/` (fitxers finals)

- [ ] **Substituir placeholders** pels fitxers finals (amb contingut real) a l’arrel de `doc/`:
  - [x] `doc/comercial_2425_EduConnect.pdf` (REAL)
  - [x] `doc/tecnica_2425_EduConnect.pdf` (REAL)
  - [x] `doc/resum_2425_EduConnect.pdf` (REAL)
  - [ ] `doc/demo_2425_EduConnect.mp4` (PENDENT: ACTUALMENT 20KB)
  - [x] `doc/pitch_2425_EduConnect.mp4` (REAL)
- [ ] Verificar que **es poden obrir amb VLC** (MP4) i amb qualsevol lector PDF, i que el pes/durada són coherents.
- [ ] Verificar que el **pitch dura exactament 1:00** (ni més ni menys).

## Prioritat 1 — Presentació i qualitat (format i “bona presentació”)

- [x] Corregir **encoding (UTF-8)** en documents que mostren caràcters tipus `Ã³`, `Ã¨`, etc.
- [x] Revisar coherència de **noms i rols** (integrants, responsables, curs/cicle, etc.) a tots els documents.
- [x] Afegir/organitzar una carpeta d’**assets** (logos, captures) per reutilitzar en PDFs/presentacions (`doc/img/manual/`).

## A — Presentació Resum (PDF) (`resum_2425_EduConnect.pdf`)

Font actual: `doc/A-Resum/resum.md`.

- [x] Diapo 1: completar frase descriptiva, curs/cicle, i afegir logo escuela.
- [x] Diapo 2: afegir **captura significativa** del projecte.
- [x] Diapo 3: escriure **abstract** (màx. 10 línies).
- [x] Diapo 4: afegir **logos tecnologies** (web, backend, BD, etc.).
- [x] Afegir 4–8 captures d’ús de l’app (flux principal) amb peu de foto.
- [x] Generar el PDF final i substituir `doc/resum_2425_EduConnect.pdf`.

## B — Planificació (`doc/PLANIFICACIO.md`)

- [x] Corregir encoding a UTF-8.
- [x] Validar que hi ha **enumeració de sprints** (incloent fase MVP) i **llistat de tasques i persones** per sprint.
- [x] Confirmar/afegir **testing d’usuari** amb escenaris i feedback.
- [x] Eliminar referències a Discord (projecte centrat en Web Core).

## C — Disseny (al Git) (`doc/C-Disseny/`)

- [x] Corregir encoding a UTF-8.
- [x] Verificar que el **flux de pantalles** cobreix tot el recorregut.
- [x] Verificar que els diagrames (UML/E-R) són **coherents amb el codi** (Discord eliminat).
- [x] Crear document de **Mockups/Wireframes** amb la interfície final (`doc/C-Disseny/Mockups.md`).

## D — Codi font + instal·lació/desplegament (al Git)

- [x] Verificar que `doc/D-CodiFont/INSTALL.md` permet muntar el projecte des de zero.
- [x] Afegir `*.env.example` per backend i documentar-lo.
- [x] Documentar instal·ladors/compilació (Web build i Backend setup).
- [x] Revisar que el repo conté tot el necessari per desplegar (Docker, Caddyfile).

## E — Documentació tècnica (punt d’entrada) (`doc/E-Documentacio-Tecnica/README.md`)

- [x] Completar “Configuració (env)” (BD, secrets, ports).
- [x] Escriure l’**arquitectura** (auth/rols, realtime socket.io, WebRTC).
- [x] Indicar “on tocar codi primer”: fitxers d’entrada reals.
- [x] Eliminar rastro de Discord en l'arquitectura.

## F — Presentació funcional/comercial (PDF) (`comercial_2425_EduConnect.pdf`)

Font actual: `doc/F-Comercial/comercial.md`.

- [x] Definir objectius i abast.
- [x] Llistar funcionalitats amb enfocament comercial.
- [x] Estudi de competència (Moodle vs Classroom vs EduConnect).
- [x] Costos/requeriments: mà d’obra, infra, manteniment.
- [x] Roadmap i proposta de valor.
- [x] Generar el PDF final i substituir `doc/comercial_2425_EduConnect.pdf`.

## G — Demo (vídeo) (`demo_2425_EduConnect.mp4`)

Guia: `doc/G-Demo/README.md`.

- [ ] Gravar demo completa (login → dashboard → horaris → recursos → notificacions → responsivitat web).
- [ ] Verificar àudio/qualitat i que s’entén sense context.
- [ ] Exportar a MP4 i substituir `doc/demo_2425_EduConnect.mp4`.

## H — Presentació tècnica (PDF) (`tecnica_2425_EduConnect.pdf`)

Font actual: `doc/H-Tecnica/tecnica.md`.

- [x] Omplir evolució per sprints (coherent amb `doc/PLANIFICACIO.md`).
- [x] Documentar problemes reals trobats (Socket.io, Col·lisions) i solucions.
- [x] Explicar decisions tècniques i arquitectura (incloent DevOps: Docker/Fail2Ban).
- [x] Generar el PDF final i substituir `doc/tecnica_2425_EduConnect.pdf`.

## I — Manual d’usuari (`doc/MANUAL.md`)

- [x] Corregir encoding a UTF-8.
- [x] Afegir captures reals (pas a pas).
- [x] Separar instruccions per rol (alumne/professor).
- [x] Eliminar secció de Discord.

## J — Pitch (1 minut) (`pitch_2425_EduConnect.mp4`)

- [x] Verificar presència del fitxer real (69 MB).
- [ ] Comprovar que la durada és exactament 1:00.

## Checklist final (abans d’entregar)

- [x] `doc/README.md` reflecteix l’estat real.
- [x] Tots els PDFs (Resum, Comercial, Tècnica) són reals i en la raïl.
- [ ] El vídeo de la Demo és real.
- [x] No hi ha caràcters corruptes a la documentació.
