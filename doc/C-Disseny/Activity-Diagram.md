# Diagrama d'Activitats: Flux de Notificacions

Aquest diagrama descriu el procés des que un professor crea una notificació fins que arriba a l'alumne per múltiples canals.

```mermaid
activityDiagram
    start
    :Professor crea avís/examen;
    :Backend rep petició POST;
    if (És vàlid?) then (sí)
        :Backend guarda notificació a DB;
        :Emissió via Socket.io (Web);
        :Usuari rep Toast instantani;
    else (no)
        :Retorna error 400;
        stop
    endif
    :Alumne visualitza la notificació;
    stop
```

> Nota: El format `activityDiagram` de Mermaid és conceptual. Utilitzem `flowchart` per a una millor visualització si és necessari.

```mermaid
graph TD
    A[Inici: Professor crea avís] --> B{Backend valida dades}
    B -- No --> C[Error 400]
    B -- Sí --> D[Guardar en MongoDB]
    D --> E[Socket.io: Emissió Real-time]
    E --> F[Web: Notificació Toast]
    F --> I[Fi: Alumne informat]
```
