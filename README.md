# EduConnect Project

Proyecto final DAM - EduConnect.
Integrantes: Arnau, Marc.

## Estructura del Proyecto

El proyecto está dividido en tres partes principales:

- **main/backend**: Servidor Node.js con Express y MySQL.
- **main/frontend**: Aplicación web React con Vite.
- **main/expo-mobile**: Aplicación móvil con React Native y Expo.

### Opción 1: En terminales separadas

Para ejecutar todo el sistema de forma separada, necesitas abrir **3 terminales** y ejecutar los siguientes comandos en cada una:

#### 1. Backend
```powershell
cd main/backend
npm install
npm run dev
```

#### 2. Frontend
```powershell
cd main/frontend
npm install
npm run dev
```

#### 3. Móvil
```powershell
cd main/expo-mobile
npm install
npm start
```

### Opción 2: Comando unificado (Frontend + Backend con Docker)

Para iniciar el proyecto completo (Frontend web y Backend con Docker) desde la raíz del proyecto, puedes usar un solo comando. Asegúrate de tener **Docker Desktop abierto** antes de ejecutarlo.

```powershell
npm start
```
*(También puedes ejecutar este comando desde la carpeta `main`)*

Esto se encargará de:
1. Levantar el **Frontend** en el puerto 5173.
2. Levantar el **Backend y la base de datos** usando `docker-compose up --build`.

## Usuarios de Prueba

Puedes usar los siguientes usuarios para probar la aplicación (la contraseña es la misma que el correo):

### Profesores
- `xavi@inspedralbes.cat` (Password: `xavi@inspedralbes.cat`)

### Alumnos 
- `a24arnpergan@inspedralbes.cat` (Password: `a24arnpergan@inspedralbes.cat`)
- `a24marcarmon@inspedralbes.cat` (Password: `a24marcarmon@inspedralbes.cat`)

