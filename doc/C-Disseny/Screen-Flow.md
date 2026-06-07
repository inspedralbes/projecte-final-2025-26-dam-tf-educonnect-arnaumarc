# Flux de Pantalles (UX Flow)

Aquest document detalla la navegació de l'aplicació per als dos rols principals: Alumne i Professor.

## Flux de l'Alumne

```mermaid
graph LR
    Login[Login Screen] --> Dashboard[Dashboard / Tauló]
    Dashboard --> Notificacions[Panell de Notificacions]
    Dashboard --> Horari[Agenda / Horari Setmanal]
    Dashboard --> Assignatures[Llista d'Assignatures]
    Assignatures --> Detall[Detall de l'Assignatura]
    Detall --> Recursos[Recursos i Tasques]
    Detall --> Meet[Videollamada Meet]
    Dashboard --> Perfil[Perfil d'Usuari]
```

## Flux del Professor

```mermaid
graph LR
    Login[Login Screen] --> DashboardProfe[Dashboard Professor]
    DashboardProfe --> EditorHorari[Schedule Editor - Drag & Drop]
    DashboardProfe --> GestioAssignatures[Gestió d'Assignatures]
    GestioAssignatures --> CrearRecurs[Penjar Recursos / Tasques]
    DashboardProfe --> EnviarAvis[Enviar Notificació Omnicanal]
    DashboardProfe --> Perfil[Perfil d'Usuari]
```

## Resum de Navegació
1.  **Login**: Identificació d'usuari i redirecció segons rol.
2.  **Dashboard**: Vista principal amb els avisos de l'EduBot i resum del dia.
3.  **Gestió/Estudi**: Accés als materials d'estudi (alumne) o eines d'edició (professor).
4.  **Comunicació**: Accés directe a Meet i notificacions en temps real.
```
