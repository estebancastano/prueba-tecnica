# Sistema Financiero - Gestión de Movimientos, Usuarios y Reportes

Este proyecto es un sistema web desarrollado con **Next.js**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, y **Prisma** como ORM, utilizando **Supabase (PostgreSQL)** como base de datos.  

El sistema permite gestionar ingresos y egresos, usuarios, y generar reportes con gráficos y CSV. Se implementa autenticación con **Better Auth** y control de roles (RBAC).

---

##  Tecnologías utilizadas

- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend / API:** Next.js API Routes, Prisma ORM
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Better Auth (GitHub OAuth)
- **Testing:** Jest

---

##  Instalación y ejecución local

1. Clonar el repositorio:

```bash
git clone https://github.com/estebancastano/prueba-tecnica.git
cd prueba-tecnica
``` 
2. Instalar dependencias:

```bash
npm install
```
3. Ejecutar migraciones de Prisma:

```bash
npx prisma migrate dev --name init
```
4. Levantar el proyecto en modo desarrollo:

```bash
npm run dev
```
El proyecto estará disponible en http://localhost:3000.

---



## Autenticación con GitHub (OAuth)

Este proyecto utiliza Better Auth para autenticación mediante GitHub. Para que funcione correctamente, necesitas:

- Crear una OAuth App en GitHub:
 
- Ir a GitHub Developer Settings → OAuth Apps

- Hacer clic en New OAuth App

### Configurar:

- Application name: Nombre de tu proyecto

- Homepage URL: http://localhost:3000 (en desarrollo)

- Authorization callback URL: http://localhost:3000/api/auth/callback/github

- Guardar y copiar Client ID y Client Secret

- Configurar variables de entorno en tu proyecto:

``` 
GITHUB_CLIENT_ID=tu_client_id
GITHUB_CLIENT_SECRET=tu_client_secret
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
``` 

En Vercel, agregar las mismas variables de entorno para que la app desplegada también funcione.

🔹 Nota: Si el usuario inicia sesión con GitHub y no tiene teléfono registrado, la aplicación redirige automáticamente a /complete-profile para completar el perfil.

--- 

## Documentación de la API (OpenAPI/Swagger)

Toda la documentación de la API se encuentra disponible en la ruta:


http://localhost:3000/docs


Allí podrás consultar los endpoints de movimientos, usuarios y reportes, incluyendo ejemplos y estructuras de request/response.

---

##  Funcionalidades
- Gestión de movimientos

- Listado de ingresos y egresos

- Crear movimientos

- Cálculo automático del saldo actual

### Gestión de usuarios (solo admin)

- Listado de usuarios

- Editar usuarios

- Asignación de roles (ADMIN o USUARIO)

### Reportes

- Gráficos de movimientos usando Recharts

- Descarga de reportes en CSV

### Autenticación y roles

- Inicio de sesión con GitHub

- Redirección a completar perfil si faltan datos (como teléfono)
 
- Control de acceso por roles (RBAC)

---
## Pruebas

Para ejecutar pruebas unitarias con Jest:

```bash
npx jest
```
---

## Despliegue en Vercel desde el repositorio

1. **Conectar el repositorio en Vercel**  
   - Ingresa a [https://vercel.com](https://vercel.com) y haz clic en **New Project → Import Git Repository**.  
   - Selecciona tu repositorio de GitHub donde está el proyecto.

2. **Configurar variables de entorno**  
   - Ve a **Settings → Environment Variables**.  
   - Agrega las mismas variables que tienes en local:  
     ```
     DATABASE_URL=postgresql://<usuario>:<password>@<host>:<puerto>/<db>
     NEXT_PUBLIC_APP_URL=https://<tu-dominio>.vercel.app
     NEXT_PUBLIC_AUTH_URL=https://<tu-dominio>.vercel.app
     GITHUB_CLIENT_ID=<tu_client_id>
     GITHUB_CLIENT_SECRET=<tu_client_secret>
     ```

3. **Deploy automático**  
   - Cada vez que hagas **push** a la rama principal (`main` o `master`), Vercel construirá y desplegará automáticamente el proyecto.

4. **Acceder a la app**  
   - Una vez desplegado, tu proyecto estará disponible en:  
     ```
     https://tudominio.vercel.app
     ```




El despliegue quedó en la siguiente url: 
https://prueba-fullstack-esteban.vercel.app

---

## Notas adicionales

- Se priorizó la funcionalidad y seguridad sobre el diseño.

- Los nombres de rutas y variables siguen un estándar consistente.

---

## Registro de desarrollo

Día 1: Estructura inicial, Next.js + TypeScript + Tailwind + Prisma ✅

Día 2: Backend / API, CRUD de usuarios y movimientos, RBAC ✅

Día 3: Frontend movimientos, tablas y formularios ✅

Día 4: Gestión de usuarios y reportes ✅

Día 5: Pruebas con Jest, ajustes finales y documentación ✅