## Context

EduConnect disposa d'un frontend web reactiu, una app mòbil amb Expo i un bot de Discord. Actualment, no existeix cap document que expliqui el funcionament d'aquests mòduls de forma integrada per a l'usuari final. La documentació existent és purament tècnica o de planificació.

## Goals / Non-Goals

**Goals:**
- Crear un manual d'usuari (`MANUAL.md`) exhaustiu i fàcil de llegir.
- Diferenciar clarament les guies per a Alumnes i Professors.
- Documentar les integracions amb Discord i Meet.
- Establir una estructura de carpetes per a actius visuals.

**Non-Goals:**
- No es farà traducció a múltiples idiomes en aquesta fase (només Català).
- No s'inclouran vídeos tutorials, només text i espais per a imatges.
- No es modificarà el codi font de l'aplicació.

## Decisions

### 1. Format Markdown (`.md`)
S'ha escollit Markdown per sobre de PDF o Wiki externa perquè:
- Permet el control de versions juntament amb el codi.
- És fàcil de mantenir i renderitzar en GitHub/VSCode.
- Permet enllaçar directament a fitxers del projecte.

### 2. Estructura de Seccions per Mòduls
En lloc de fer un manual lineal, s'organitzarà per "Mòduls de Valor" (Tauló, Horaris, Recursos) per facilitar la cerca d'informació específica.

## Risks / Trade-offs

- **Sincronització**: Hi ha el risc que el manual quedi desincronitzat si s'afegeixen noves funcionalitats al frontend.
  - **Mitigació**: Establir el manual com a part del flux de treball OpenSpec per a futurs canvis.
- **Mida del fitxer**: Un manual molt llarg pot ser difícil de navegar.
  - **Mitigació**: Ús intensiu de taules de continguts i àncores (links interns).
