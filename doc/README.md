# Documentació (EduConnect)

Tota la documentació d'entrega és dins `./doc`.

## Entrega mínima a l’arrel de `doc/`
A l’arrel de `doc/` hi ha (com a mínim) aquests fitxers, tal com demanen els requisits:

- `comercial_2425_EduConnect.pdf`
- `tecnica_2425_EduConnect.pdf`
- `resum_2425_EduConnect.pdf`
- `pitch_2425_EduConnect.mp4`
- `demo_2425_EduConnect.mp4`

> Nota: aquests fitxers es generen amb l’script `doc/tools/generate-required-assets.mjs` i després s’han de **substituir** pels PDFs i vídeos finals (amb contingut real) abans de l’entrega.

## 10 apartats (A–J)

- **A. Presentació resum (PDF)**: `A-Resum/resum.md`
- **B. Planificació**: `PLANIFICACIO.md`
- **C. Disseny (wireframes + UML/E-R)**: `C-Disseny/`
- **D. Codi font + instal·ladors + manual instal·lació/desplegament**: `D-CodiFont/INSTALL.md` i `../main/`
- **E. Documentació tècnica (punt d’entrada per contribuïdors)**: `E-Documentacio-Tecnica/README.md`
- **F. Presentació funcional/comercial (PDF)**: `F-Comercial/comercial.md`
- **G. Demo (vídeo)**: `G-Demo/README.md`
- **H. Presentació tècnica (PDF)**: `H-Tecnica/tecnica.md`
- **I. Manual d’usuari**: `MANUAL.md`
- **J. Pitch (1 minut)**: `J-Pitch/README.md`

## Generació ràpida (placeholders)

- Genera els fitxers mínims a l’arrel de `doc/`:
  - `node doc/tools/generate-required-assets.mjs`

