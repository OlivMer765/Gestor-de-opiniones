# Gestor-de-Opiniones
## API Gestor de Opiniones

Esta documentación detalla la estructura, configuración y endpoints implementados hasta la fecha en el servidor de **Gestor de Opiniones**. El sistema está construido sobre **Node.js** con **Express** (v5) y **MongoDB**.

---

## 0. Requisitos del Sistema

Antes de comenzar, asegúrate de tener instalado lo siguiente:

* **Node.js:** v18.0 o superior
* **MongoDB:** Última versión estable (Local o Atlas)
* **pnpm:** Gestor de paquetes recomendado para este proyecto
* **Git:** Para clonar el repositorio

---

## 1. Stack Tecnológico y Dependencias

El proyecto utiliza las siguientes tecnologías clave para su funcionamiento:

* **Runtime:** Node.js
* **Framework:** Express.js (v5.0.1)
* **Base de Datos:** MongoDB (con Mongoose como ODM)
* **Seguridad:**
  * `argon2`: Para el hashing y verificación de contraseñas.
  * `jsonwebtoken`: Para la generación y validación de tokens de sesión (JWT).
  * `helmet`: Para la protección de cabeceras HTTP.
* **Validación:** `express-validator` para la sanitización y validación de datos de entrada.
* **Utilidades:** `cors`, `dotenv`, `morgan`.
* **Rate Limiting:** `express-rate-limit` para prevenir ataques de fuerza bruta en el login.

---

## 2. Estructura de Carpetas del Proyecto

El repositorio en la rama `dev` está organizado de la siguiente manera:

```text
Gestor-de-Opiniones/
├── configs/               # Configuración principal
│   ├── app.js             # Configuración de Express y middlewares globales
│   ├── db.js              # Conexión a MongoDB
│   ├── admin.seed.js      # Seeding del usuario administrador por defecto
│   ├── cors-configuration.js
│   └── helmet-configuration.js
├── middlewares/           # Middlewares personalizados
│   ├── auth-validators.js # Validaciones de registro y login
│   ├── validate-jwt.js    # Interceptor y validador de JWT
│   ├── validate-roles.js  # Verificación de roles (ADMIN_ROLE, USER_ROLE)
│   ├── request-limit.js   # Límite de peticiones (Rate Limit)
│   └── handle-error.js    # Manejo global de errores
├── src/
│   ├── auth/              # Lógica y rutas de Autenticación
│   ├── users/             # Gestión de perfiles de Usuario
│   ├── publications/      # Gestión de Publicaciones (Posts)
│   ├── comments/          # Gestión de Comentarios en publicaciones
│   └── utils/             # Utilidades compartidas (encrypt.js, jwt.js)
├── Postman/               # Colecciones de peticiones para testing
├── frontend/              # Archivos para el lado del cliente (si aplica)
├── index.js               # Punto de entrada de la aplicación
├── package.json           # Dependencias y scripts
└── pnpm-lock.yaml         # Árbol de dependencias bloqueado
```

---

## 3. Configuración y Base de Datos

### Conexión a Base de Datos (`configs/db.js`)
El sistema gestiona la conexión a MongoDB con un listener de eventos para monitorear el estado y aplicar cierres seguros (`gracefulShutdown`) en caso de detener el servidor.

### Seeding Inicial de Administrador (`configs/admin.seed.js`)
Al iniciar la aplicación y conectarse a la BD, se ejecuta automáticamente un script que verifica la existencia del administrador base. Si no existe, lo crea:

* **Username:** `admin`
* **Email:** `admin@gestor.com`
* **Password:** `Admin123!` (Cifrada con Argon2)
* **Rol:** `ADMIN_ROLE`

---

## 4. Cómo Clonar y Ejecutar el Programa

### Paso 1: Clonar el Repositorio y cambiar a Dev

```bash
git clone https://github.com/OlivMer765/Gestor-de-Opiniones.git
cd Gestor-de-Opiniones
git checkout dev
```

### Paso 2: Instalar Dependencias

```bash
pnpm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Servidor
PORT=3000

# Base de Datos
URI_MONGODB=mongodb://localhost:27017/GestorOpinionesDB

# JWT y Seguridad
SECRET_KEY=SecretKeyGestorOpiniones2024
```

### Paso 4: Iniciar el Servidor

Para correr en modo desarrollo con auto-recarga (`nodemon`):

```bash
pnpm dev
```

El servidor estará disponible en: `http://localhost:3000/GestorOpiniones/v1`

---

## 5. Versiones Utilizadas

| Dependencia | Versión | Descripción |
|------------|---------|-------------|
| **Node.js** | >=18 | Runtime de JavaScript |
| **Express.js** | 5.0.1 | Framework web robusto |
| **Mongoose** | 8.23.0 | ODM para MongoDB |
| **argon2** | 0.41.1 | Hash seguro de contraseñas |
| **jsonwebtoken** | 9.0.2 | Gestión de tokens de acceso (JWT) |
| **helmet** | 8.0.0 | Seguridad de headers HTTP |
| **cors** | 2.8.5 | Middleware para Cross-Origin Resource Sharing |
| **express-validator** | 7.2.1 | Validación de datos de entrada |
| **express-rate-limit** | 7.5.0 | Límite de peticiones (ej. login) |
| **morgan** | 1.10.0 | Logger de peticiones HTTP en desarrollo |
| **nodemon** | 3.1.9 | Auto-reload en entorno de desarrollo |

---

## 6. Ubicación de las Rutas

Las rutas de la API están organizadas por módulos. Se configuran dentro de `configs/app.js` e invocan los archivos de rutas de cada carpeta en `src/`:

| Módulo | Ruta de Archivos | Base URL |
|--------|------------------|----------|
| **Salud del Server**| `configs/app.js` | `/health` |
| **Autenticación** | `src/auth/auth.routes.js` | `/auth` |
| **Usuarios** | `src/users/user.routes.js` | `/users` |
| **Publicaciones** | `src/publications/publication.routes.js`| `/publications` |
| **Comentarios** | `src/comments/comment.routes.js` | `/comments` |

**Base URL Completa:** `http://localhost:3000/GestorOpiniones/v1`

---

## 7. Módulos de Seguridad (Middleware y Utils)

### Utilidades (`src/utils/`)
* **`encrypt.js`:** Expone `encrypt` para hashear contraseñas y `verifyPassword` para compararlas usando Argon2.
* **`jwt.js`:** Contiene `generateJWT` que crea un token con expiración de 8 horas, incrustando el `uid`, `username`, `email` y `role` en el payload.

### Middlewares (`middlewares/`)
* **`validate-jwt.js`:** Intercepta la petición, verifica el Bearer Token, y adjunta la información validada en `req.user`.
* **`validate-roles.js` (`hasRoles`):** Verifica que el usuario autenticado (extraído por el JWT) posea alguno de los roles requeridos para la acción.
* **`request-limit.js`:** Aplica límites para evitar ataques de denegación o fuerza bruta (ej. aplicado en el login).

---

## 8. API Endpoints (Consultas en Postman)

### 📋 Información General

* **Base URL:** `http://localhost:3000/GestorOpiniones/v1`
* **Headers Comunes:**
  * `Content-Type`: `application/json`
  * `Authorization`: `Bearer <TU_TOKEN_JWT>` (Obligatorio en rutas marcadas con ✅ Token)

> **Nota:** Para obtener el token, utiliza el endpoint de Login y cópialo. Luego utilízalo en la pestaña "Authorization" de Postman seleccionando "Bearer Token".

---

### 🔐 1. Autenticación (`/auth`)

*Gestión de acceso y registro en el sistema.*

| Método | Endpoint Completo | Auth? | Descripción | Body (JSON) Sugerido |
| --- | --- | --- | --- | --- |
| **POST** | `/auth/register` | ❌ No | Registrar un nuevo usuario (`USER_ROLE`). | `{"username": "johndoe", "email": "john@mail.com", "password": "123", "name": "John Doe"}` |
| **POST** | `/auth/login` | ❌ No | Iniciar sesión y obtener JWT. Admite email o username. | `{"identifier": "johndoe", "password": "123"}` |
| **GET** | `/auth/me` | ✅ Token | Ver datos del usuario autenticado actualmente. | *N/A* |

---

### 👤 2. Perfil de Usuario (`/users`)

*Gestión del perfil personal (propios datos).*

| Método | Endpoint Completo | Auth? | Descripción | Body (JSON) Sugerido |
| --- | --- | --- | --- | --- |
| **GET** | `/users/profile` | ✅ Token | Obtener los detalles del propio perfil. | *N/A* |
| **PUT** | `/users/profile` | ✅ Token | Actualizar el propio perfil (nombre, user, o contraseña si se envía la anterior). | `{"name": "John Nuevo", "oldPassword": "123", "newPassword": "321"}` |

---

### 📝 3. Publicaciones (`/publications`)

*Gestión de entradas, posts o publicaciones.*

| Método | Endpoint Completo | Auth? | ¿Qué es el `:id`? | Descripción | Body (JSON) Sugerido |
| --- | --- | --- | --- | --- | --- |
| **GET** | `/publications?page=1&limit=10`| ❌ No | N/A | Listar publicaciones activas con paginación. | *N/A* |
| **GET** | `/publications/:id` | ❌ No | **ID de Publicación** | Ver el detalle de una publicación junto con sus comentarios. | *N/A* |
| **POST** | `/publications` | ✅ Token | N/A | Crear una nueva publicación (se asigna a tu usuario). | `{"title": "Mi primer post", "category": "General", "content": "Hola mundo"}` |
| **PUT** | `/publications/:id` | ✅ Token | **ID de Publicación** | Editar tu publicación. Solo el dueño puede editarla. | `{"content": "Contenido actualizado"}` |
| **DELETE**| `/publications/:id` | ✅ Token | **ID de Publicación** | Eliminar lógicamente tu publicación. | *N/A* |

---

### 💬 4. Comentarios (`/comments`)

*Reacciones y opiniones ligadas a las publicaciones.*

| Método | Endpoint Completo | Auth? | ¿Qué es el `:id` o `:publicationId`? | Descripción | Body (JSON) Sugerido |
| --- | --- | --- | --- | --- | --- |
| **POST** | `/comments` | ✅ Token | N/A | Comentar en una publicación. | `{"content": "¡Excelente post!", "publicationId": "ID_DE_LA_PUBLICACION"}` |
| **GET** | `/comments/publication/:publicationId`| ❌ No | **ID de Publicación** | Obtener los comentarios de una publicación específica. | *N/A* |
| **PUT** | `/comments/:id` | ✅ Token | **ID de Comentario** | Editar un comentario tuyo. | `{"content": "Modifico mi opinión"}` |
| **DELETE**| `/comments/:id` | ✅ Token | **ID de Comentario** | Eliminar un comentario tuyo (baja lógica). | *N/A* |

---

### 💡 Notas Importantes

1. **Borrado Lógico:** Las publicaciones y comentarios eliminados actualizan su variable interna `status: false` en lugar de desaparecer permanentemente de la BD para cuidar la integridad referencial.
2. **Propiedad de los Datos:** Un usuario **solo puede actualizar o eliminar** sus propias publicaciones o comentarios (verificado en cada controlador comparando `req.user._id` con la propiedad `author` del documento).
3. **Paginación:** El endpoint de obtener todas las publicaciones soporta paginación usando Query Params opcionales: `?limit=10&page=1`.