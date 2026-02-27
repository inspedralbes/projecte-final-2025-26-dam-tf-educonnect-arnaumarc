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

### Opción 2: Con un solo comando (Concurrent)

Si prefieres ejecutar todo en una sola terminal (Backend, Frontend y Móvil), puedes hacerlo con un único comando. 

Primero asegúrate de instalar todas las dependencias (solo la primera vez o si se añaden paquetes):
```powershell
cd main
npm run install-all
```

Luego, para iniciar los tres servidores a la vez:
```powershell
cd main
npm run start-all
```
Esto levantará el **Backend** (puerto 3005), el **Frontend** (puerto 5173) y el proyecto **Móvil (Expo)** usando `concurrently` en la misma ventana de comandos.

## Usuarios de Prueba

Puedes usar los siguientes usuarios para probar la aplicación (la contraseña es la misma que el correo):

### Profesores
- `xavi@inspedralbes.cat` (Password: `xavi@inspedralbes.cat`)

### Alumnos 
- `a24arnpergan@inspedralbes.cat` (Password: `a24arnpergan@inspedralbes.cat`)
- `a24marcarmon@inspedralbes.cat` (Password: `a24marcarmon@inspedralbes.cat`)

