# 📖 Páginas Amarillas Nicaragua — Directorio Comercial y de Contactos

Plataforma web completa de directorio comercial inspirada en el portal de [Páginas Amarillas de Nicaragua](https://www.paginasamarillas.com.ni/). Desarrollada con **Laravel 13 (API REST)** en el backend, **React 19 con TypeScript** en el frontend y **MySQL** como base de datos relacional.

Permite consultar, registrar, gestionar y publicar contactos de negocios de toda Nicaragua con teléfonos directos, botones de WhatsApp, horarios, ubicación geográfica y validación administrativa previa a su publicación.

---

## 🚀 Arquitectura y Tecnologías

### Backend (API REST)
- **Framework:** Laravel 13 (PHP 8.3+)
- **Base de Datos:** MySQL (`utf8mb4_unicode_ci`)
- **Autenticación:** Laravel Sanctum (Tokens de Acceso Personal)
- **Almacenamiento de Archivos:** Storage local con symlink público (`storage:link`) para subida y validación de logos (máx. 2 MB, formatos JPEG, PNG, WEBP, SVG)
- **Control de Roles:** Middleware de autorización (`admin`, `owner`, `visitor`)
- **Migraciones y Seeders:** Datos reales de ciudades de Nicaragua (Managua, León, Granada, Masaya, etc.), rubros y 18 negocios de prueba.

### Frontend (SPA)
- **Framework:** React 19 con TypeScript y Vite
- **Estilos:** Tailwind CSS v4 (Paleta icónica amarillo `#FACC15`, negro `#0A0A0A` y blanco)
- **Rutas:** React Router DOM v7
- **Iconos:** Lucide React
- **Cliente HTTP:** Axios con interceptor automático para inyección de token Bearer de Sanctum
- **Diseño Responsive:** Adaptado a pantallas móviles, tablets y escritorios.

---

## 📁 Estructura del Proyecto

```
directcontact/
├── backend/                             # API REST en Laravel 13
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── Admin/               # Controladores Administrativos (Aprobación, CRUDs)
│   │   │   │   │   ├── AdminBusinessController.php
│   │   │   │   │   ├── AdminCategoryController.php
│   │   │   │   │   └── AdminCityController.php
│   │   │   │   ├── AuthController.php   # Registro, login, logout, me
│   │   │   │   ├── OwnerBusinessController.php # Gestión de negocios del dueño
│   │   │   │   ├── PublicBusinessController.php # Catálogo, filtros y búsqueda combinada
│   │   │   │   ├── PublicCategoryController.php # Categorías públicas
│   │   │   │   ├── PublicCityController.php     # Ciudades de Nicaragua
│   │   │   │   └── StatsController.php          # Estadísticas públicas y del admin
│   │   │   └── Middleware/
│   │   │       └── EnsureAdmin.php      # Protección de rutas de administrador
│   │   └── Models/
│   │       ├── Business.php             # Modelo de negocio con relaciones y scopes
│   │       ├── Category.php             # Categorías/Rubros
│   │       ├── City.php                 # Ciudades/Departamentos
│   │       └── User.php                 # Usuario con Sanctum HasApiTokens y roles
│   ├── database/
│   │   ├── migrations/                  # Migraciones (users, businesses, categories, cities, business_category)
│   │   ├── factories/                   # Fábricas de modelos
│   │   └── seeders/DatabaseSeeder.php   # Seeder con usuarios, ciudades y 18 negocios iniciales
│   └── routes/
│       └── api.php                      # Definición de las 33 rutas de la API REST
│
├── frontend/                            # Interfaz de usuario en React 19 + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── BusinessCard.tsx         # Tarjeta de negocio estilo Páginas Amarillas
│   │   │   ├── CategoryGrid.tsx         # Cuadrícula visual de rubros con iconos y conteos
│   │   │   ├── CategoryIcon.tsx         # Mapeo de iconos Lucide por rubro
│   │   │   ├── Footer.tsx               # Pie de página informativo con ciudades y enlaces
│   │   │   ├── HeroSearch.tsx           # Buscador central con filtros combinados
│   │   │   ├── LoadingSkeleton.tsx      # Estados de carga y skeletons animados
│   │   │   ├── Navbar.tsx               # Barra superior amarilla con menú y auth
│   │   │   └── Pagination.tsx           # Controles de paginación accesibles
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # Estado global de autenticación y permisos
│   │   ├── pages/
│   │   │   ├── HomePage.tsx             # Portada con mega-buscador y destacados
│   │   │   ├── DirectoryPage.tsx        # Catálogo filtrable por término, categoría y ciudad
│   │   │   ├── BusinessDetailPage.tsx   # Vista de detalle con teléfono, WhatsApp y horarios
│   │   │   ├── RegisterBusinessPage.tsx # Formulario con subida de logo y validaciones
│   │   │   ├── EditBusinessPage.tsx     # Edición de información de negocio
│   │   │   ├── OwnerDashboardPage.tsx   # Panel de control del propietario
│   │   │   ├── AdminDashboardPage.tsx   # Panel de aprobación y CRUD administrativo
│   │   │   ├── CategoriesPage.tsx       # Explorador de categorías
│   │   │   ├── CitiesPage.tsx           # Explorador por departamento
│   │   │   ├── LoginPage.tsx            # Login con botones de auto-llenado de prueba
│   │   │   └── RegisterUserPage.tsx     # Registro de nuevos usuarios
│   │   ├── services/
│   │   │   └── api.ts                   # Cliente Axios configurado
│   │   ├── types/
│   │   │   └── index.ts                 # Interfaces TypeScript
│   │   └── App.tsx                      # Enrutador principal de la aplicación
│
├── run-all.bat                          # Script para iniciar backend y frontend simultáneamente
├── start-backend.bat                    # Script para iniciar backend Laravel
├── start-frontend.bat                   # Script para iniciar frontend React
└── README.md                            # Guía completa de instalación y uso
```

---

## ⚡ Instalación Paso a Paso en Local

### Prerrequisitos
- PHP 8.2 o superior (con extensiones `pdo_mysql`, `fileinfo`, `mbstring`, `curl`)
- MySQL 5.7+ o MySQL 8.0+ / MariaDB (ej. Laragon o XAMPP)
- Composer 2.x
- Node.js 18+ y npm

---

### Paso 1: Configurar la Base de Datos en MySQL
Crea la base de datos `directcontact` en tu servidor MySQL:
```sql
CREATE DATABASE IF NOT EXISTS directcontact CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Paso 2: Configurar el Backend (Laravel 13)

1. Ingresa a la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Instala las dependencias de Composer:
   ```bash
   composer install
   ```

3. Configura el archivo `.env` (si no existe, copia `.env.example` a `.env`):
   ```env
   APP_NAME="Directorio Comercial Nicaragua"
   APP_ENV=local
   APP_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:3000

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=directcontact
   DB_USERNAME=root
   DB_PASSWORD=

   FILESYSTEM_DISK=public
   ```

4. Genera la clave de la aplicación y crea el enlace simbólico para las imágenes:
   ```bash
   php artisan key:generate
   php artisan storage:link
   ```

5. Ejecuta las migraciones y seeders con los datos de prueba:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. Inicia el servidor de desarrollo de Laravel:
   ```bash
   php artisan serve --port=8000
   ```
   > La API quedará disponible en: `http://localhost:8000/api`

---

### Paso 3: Configurar el Frontend (React 19 + TypeScript)

1. En una nueva terminal, ingresa a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. Instala las dependencias de Node:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev -- --port 3000
   ```
   > La aplicación web abrirá en: `http://localhost:3000`

---

## 🔑 Credenciales de Prueba Pre-cargadas

El seeder incluye 3 cuentas de usuario listas para probar cada uno de los roles (en la pantalla de Login hay botones de 1 clic para autocompletar):

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| 👑 **Administrador** | `admin@paginasamarillas.com.ni` | `admin123` | Aprueba o rechaza negocios, edita o elimina cualquier negocio, CRUD de categorías y ciudades, estadísticas. |
| 🏢 **Propietario** | `propietario@ejemplo.com` | `owner123` | Registra nuevos negocios con logo, edita y administra sus propios negocios, consulta estado de aprobación. |
| 🏢 **Propietario 2** | `mariana.lopez@ejemplo.com` | `owner123` | Dueña de negocios adicionales de prueba (Selva Negra, Hotel Colón, etc.). |
| 👤 **Visitante** | `visitante@ejemplo.com` | `visitor123` | Consulta pública del directorio, fichas de contacto y opciones de búsqueda. |

---

## 🌟 Funcionalidades Principales

### 1. Catálogo Público y Buscador Combinado
- Buscador principal con filtros combinados por **nombre/palabra clave**, **rubro/categoría** y **ciudad/departamento**.
- Endpoint optimizado: `/api/businesses?search=&category=&city=&featured=&page=`
- Tarjetas de contacto que incluyen:
  - Logo con fallback a inicial o icono
  - Nombre comercial y descripción
  - Badges de verificación y destacado
  - Teléfono directo (enlace `tel:`)
  - Enlace rápido a chat de **WhatsApp** con mensaje predeterminado
  - Dirección física en formato nicaragüense y horarios de atención
- Ficha individual de negocio con enlaces a redes sociales (Facebook, Instagram), sitio web y negocios relacionados en la misma zona.

### 2. Flujo de Aprobación de Negocios
1. Un propietario registra su empresa mediante el formulario de alta adjuntando datos y logo.
2. El negocio queda automáticamente guardado con estado `pending` (pendiente).
3. En este estado, el negocio **no** aparece en el catálogo público ni en las búsquedas abiertas.
4. El administrador recibe la solicitud en la pestaña **"Pendientes por Aprobar"** del panel `/admin/dashboard`.
5. El administrador puede:
   - **Aprobar y Publicar:** Pasa a estado `approved` y queda visible en todo el país.
   - **Rechazar:** Asigna estado `rejected` con notas explicativas (`admin_notes`) visibles únicamente para el dueño.
   - **Alternar Destacado:** Resalta el negocio con badge y prioridad en la portada.

### 3. Panel del Propietario (`/owner/dashboard`)
- Listado de negocios pertenecientes al usuario autenticado.
- Visualización en tiempo real del estado: Aprobado (Verde), Pendiente (Ámbar) o Rechazado (Rojo con mensaje del administrador).
- Opciones de edición y eliminación segura.

### 4. Panel de Administración (`/admin/dashboard`)
- Tarjetas de métricas: total de negocios, pendientes, aprobados, rechazados y usuarios.
- Cola de revisión de negocios pendientes.
- Tabla general con búsqueda y filtros para todos los negocios registrados.
- CRUD interactivo para **Categorías** (crear, editar nombre/icono, eliminar).
- CRUD interactivo para **Ciudades y Departamentos** de Nicaragua.

---

## 📡 Referencia de Rutas de la API REST

### Rutas Públicas
- `GET /api/businesses` — Listado paginado con filtros (`?search=&category=&city=&department=&featured=`).
- `GET /api/businesses/featured` — Negocios destacados para portada.
- `GET /api/businesses/{slugOrId}` — Detalle completo de un negocio y sugerencias relacionadas.
- `GET /api/categories` — Listado de categorías con conteo de negocios.
- `GET /api/categories/{slugOrId}` — Categoría individual y sus comercios.
- `GET /api/cities` — Listado de ciudades y departamentos.
- `GET /api/stats` — Resumen numérico para portada.
- `POST /api/auth/register` — Registro de usuarios (`owner` o `visitor`).
- `POST /api/auth/login` — Inicio de sesión y entrega de token Sanctum.

### Rutas Autenticadas (`Bearer Token`)
- `GET /api/auth/me` — Datos del usuario conectado.
- `POST /api/auth/logout` — Cierre de sesión y revocación de token.
- `GET /api/owner/businesses` — Negocios registrados por el usuario.
- `POST /api/owner/businesses` — Registro de nuevo negocio (Multipart Form Data para logo).
- `GET /api/owner/businesses/{id}` — Datos para edición.
- `POST /api/owner/businesses/{id}` — Actualización de información y logo.
- `DELETE /api/owner/businesses/{id}` — Eliminación de negocio propio.

### Rutas de Administración (`Middleware: admin`)
- `GET /api/admin/stats` — Métricas completas para el dashboard.
- `GET /api/admin/businesses` — Todos los negocios con filtros avanzados de auditoría.
- `PUT /api/admin/businesses/{id}/status` — Aprobación o rechazo con notas.
- `PUT /api/admin/businesses/{id}/toggle-featured` — Marcar/desmarcar negocio destacado.
- `POST /api/admin/businesses/{id}` — Edición administrativa de un negocio.
- `DELETE /api/admin/businesses/{id}` — Eliminación definitiva de un negocio.
- `GET|POST|PUT|DELETE /api/admin/categories` — CRUD de categorías.
- `GET|POST|PUT|DELETE /api/admin/cities` — CRUD de ciudades y departamentos.

---

## 🛠️ Ejecución Rápida con Scripts
Para comodidad en entornos Windows, se han incluido scripts listos para usar en la raíz:
- Doble clic en `run-all.bat` para levantar tanto el backend como el frontend al mismo tiempo en ventanas separadas.
- O ejecutar independientemente `start-backend.bat` y `start-frontend.bat`.

