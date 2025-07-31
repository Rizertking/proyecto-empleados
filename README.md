# Proyecto Empleado

Aplicación web para la gestión de empleados y solicitudes. Incluye backend con Node.js y PostgreSQL, y frontend con React.

---

## ⚙️ Archivos `.env` requeridos

### 1️⃣ `.env` dentro de la carpeta `back_end/`

📁 Ubicación: `back_end/.env`

Este archivo se utiliza para el entorno de desarrollo local.

#### Estructura esperada:

```env
PORT=              # Puerto donde se ejecutará el backend (ej. 3000)
DATABASE_URL=      # URL de conexión a la base de datos local
JWT_SECRET=        # Clave secreta usada para firmar los tokens JWT

# 🔐 Usuario administrador que se crea automáticamente al iniciar
ADMIN_EMAIL=       # Correo del usuario admin (ej. admin@example.com)
ADMIN_PASSWORD=    # Contraseña del usuario admin
ADMIN_ROLE=        # Rol del usuario admin (normalmente: admin)
```

📝 **Ejemplo de DATABASE_URL**:  
`postgres://<usuario>:<contraseña>@<host>:<puerto>/<nombre_basedatos>`  
Ejemplo ficticio:  
`postgres://postgres:MiClave.@localhost:5432/MibaseLocal`

---

### 2️⃣ `.env` en la raíz del proyecto (para uso con Docker)

📁 Ubicación: `./.env`

Este archivo es utilizado por Docker Compose para definir el entorno tanto de PostgreSQL como del backend dentro de contenedores.

#### Estructura esperada:

```env
POSTGRES_USER=       # Usuario para la base de datos dentro del contenedor
POSTGRES_PASSWORD=   # Contraseña del usuario de PostgreSQL
POSTGRES_DB=         # Nombre de la base de datos a crear

DATABASE_URL=        # URL de conexión desde el backend al contenedor PostgreSQL
JWT_SECRET=          # Clave JWT para el backend dentro de Docker
PORT=                # Puerto expuesto por el backend en el contenedor
```

📝 **Ejemplo de DATABASE_URL con Docker**:  
`postgres://<usuario>:<contraseña>@<nombre_servicio_postgres>:<puerto>/<nombre_basedatos>`  
Ejemplo ficticio:  
`postgres://postgres:MiClave.@postgres:5432/MibaseDocker`

---

## 🔒 Seguridad

Asegúrate de no subir tus archivos `.env` al repositorio público. Incluye estas líneas en tu archivo `.gitignore`:

```
.env
```

✅ Se recomienda tener un `.gitignore` tanto en la raíz como en `back_end/`.

---


---

### 📦 Instalación de dependencias

Una vez clonado el repositorio, instala las dependencias necesarias para el backend y frontend:

#### 🔧 Backend:
```bash
cd backend
npm install
```

#### 🎨 Frontend:
```bash
cd frontend
npm install
```

Esto instalará automáticamente todos los módulos listados en `package.json`.



---

### 🚀 Ejecución del proyecto

Una vez instaladas las dependencias, puedes iniciar el backend y el frontend por separado:

#### 🔧 Backend:
Ejecuta el servidor de desarrollo con:

```bash
cd backend
npm run dev
```

#### 🎨 Frontend:
Ejecuta la aplicación React con:

```bash
cd frontend
npm start
```

Esto iniciará ambas aplicaciones en modo desarrollo.  
Asegúrate de tener los archivos `.env` correctamente configurados antes de ejecutar los comandos.


# 🛠️ Creación de Base de Datos PostgreSQL

Para inicializar la base de datos, ejecuta los siguientes comandos en tu cliente de PostgreSQL:

```sql
-- 1. Crear base de datos (si no existe)
CREATE DATABASE Myprueba;

-- 2. Conectarse a la base de datos
\c Myprueba;

-- 3. Crear tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'empleado'
);

-- 4. Crear tabla de empleados
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  fecha_ingreso DATE NOT NULL,
  salario NUMERIC(10, 2) NOT NULL
);

-- 5. Crear tabla de solicitudes con relación a usuarios
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Crear índices para mejorar rendimiento de búsquedas
CREATE INDEX idx_requests_description ON requests (description);
CREATE INDEX idx_employees_name ON employees (name);
CREATE INDEX idx_users_email ON users (email);
