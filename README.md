# API de Reserva de Espacios Deportivos

Este proyecto es una API REST construida con NestJS que permite gestionar la reserva de espacios deportivos. Incluye autenticacion con JWT, doble factor de verificacion, pagos con notificacion por WhatsApp via Twilio, y validaciones de horarios y capacidad.

---

## Integrantes

- Mateo Quintero 
- Juan Sebastian Lopez
- Isabela Quintero     

---

## Tecnologias usadas

- NestJS (Framework principal)
- TypeORM (Conexion a base de datos)
- MySQL (Base de datos)
- JWT (Autenticacion con tokens)
- Bcrypt (Encriptacion de contrasenas)
- Twilio (Notificaciones por WhatsApp)
- Nodemailer + @nestjs-modules/mailer (Envio de correos)
- Class-validator (Validacion de datos)
- Passport (Middleware de autenticacion)

---

## Requisitos previos

Antes de correr el proyecto necesitas tener instalado:

- Node.js (version 18 o superior)
- MySQL corriendo (se recomienda Laragon en Windows)
- Una cuenta de Twilio con sandbox de WhatsApp activo
- Una cuenta de Gmail con contrasena de aplicacion generada

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ReservaEspaciosDeportivos.git
cd ReservaEspaciosDeportivos
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar el archivo .env

Crea un archivo llamado `.env` en la raiz del proyecto (donde esta el `package.json`) y pega lo siguiente con tus propios datos:

```env
# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reservas_db
DB_USERNAME=root
DB_PASSWORD=root

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=tu_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Gmail (Correo para doble factor)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_contrasena_de_aplicacion
MAIL_FROM=tu_correo@gmail.com
```

### Como conseguir las credenciales de Twilio

1. Entra a twilio.com y crea una cuenta gratuita
2. Ve a la seccion de WhatsApp Sandbox
3. Sigue las instrucciones para activar el sandbox (enviar un mensaje al numero de Twilio)
4. Copia el ACCOUNT_SID y AUTH_TOKEN desde el dashboard
5. El numero de Twilio para sandbox es siempre `whatsapp:+14155238886`

### Como conseguir la contrasena de aplicacion de Gmail

1. Entra a myaccount.google.com
2. Ve a Seguridad
3. Activa la Verificacion en dos pasos si no la tienes
4. Busca Contrasenas de aplicaciones
5. Crea una nueva contrasena, ponle de nombre "NestJS"
6. Copia la clave de 16 caracteres que te genera y pegala en MAIL_PASS del .env

---

## 4. Crear la base de datos

Abre MySQL (desde Laragon o desde la terminal) y crea la base de datos:

```sql
CREATE DATABASE reservas_db;
```

No necesitas crear las tablas manualmente, TypeORM las crea automaticamente cuando corres el proyecto.

---

## 5. Correr el proyecto

```bash
npm run start:dev
```

El servidor queda corriendo en `http://localhost:3000`

---

## 6. Endpoints disponibles

### Usuarios

| Metodo | URL | Descripcion | Requiere token |
|--------|-----|-------------|----------------|
| POST | /usuarios | Registrar nuevo usuario | No |
| GET | /usuarios/me | Ver mi perfil | Si |
| GET | /usuarios | Listar todos los usuarios | Si (admin) |
| GET | /usuarios/:id | Ver usuario por ID | Si (admin) |
| PATCH | /usuarios/:id | Actualizar usuario | Si (admin) |
| DELETE | /usuarios/:id | Eliminar usuario | Si (admin) |
| POST | /usuarios/:id/generar-codigo-compra | Generar codigo de compra | Si |
| POST | /usuarios/hacer-admin/:id | Hacer admin a un usuario | Si (admin) |

### Autenticacion

| Metodo | URL | Descripcion | Requiere token |
|--------|-----|-------------|----------------|
| POST | /auth/login | Primer paso del login | No |
| POST | /auth/verificar-codigo | Verificar codigo del doble factor | No |
| POST | /auth/refresh-token | Renovar el token | No |
| POST | /auth/logout | Cerrar sesion | Si |

### Escenarios

| Metodo | URL | Descripcion | Requiere token |
|--------|-----|-------------|----------------|
| POST | /escenarios | Crear escenario deportivo | Si (admin) |
| GET | /escenarios | Listar todos los escenarios | Si |
| GET | /escenarios/:id | Ver escenario por ID | Si |

### Reservas

| Metodo | URL | Descripcion | Requiere token |
|--------|-----|-------------|----------------|
| POST | /reservas | Crear una reserva | Si |
| GET | /reservas | Listar todas las reservas | Si |
| GET | /reservas/totales | Ver totales por escenario | Si |
| GET | /reservas/:id | Ver reserva por ID | Si |
| DELETE | /reservas/:id | Eliminar reserva | Si |

### Pagos

| Metodo | URL | Descripcion | Requiere token |
|--------|-----|-------------|----------------|
| POST | /pagos/procesar | Procesar pago de una reserva | Si |
| GET | /pagos/totales | Ver totales de dinero recaudado | No |

---

## 7. Como usar la API paso a paso Body postman

### Paso 1: Registrar un usuario

```
POST http://localhost:3000/usuarios
```
```json
{
  "nombre": "Carlos Perez",
  "correo": "carlos@test.com",
  "contrasena": "123456"
}
```

### Paso 2: Hacer login

```
POST http://localhost:3000/auth/login
```
```json
{
  "correo": "carlos@test.com",
  "contrasena": "123456"
}
```

Si es el primer inicio de sesion, llegara un codigo de verificacion al correo.

### Paso 3: Verificar el codigo del doble factor

```
POST http://localhost:3000/auth/verificar-codigo
```
```json
{
  "usuarioId": 1,
  "codigo": "123456"
}
```

Esto te devuelve el `access_token` que necesitas para los siguientes pasos.

### Paso 4: Usar el token en Postman

En cada peticion que requiera autenticacion, agrega en los Headers:
- Key: `Authorization`
- Value: `Bearer tu_token_aqui`

### Paso 5: Crear un escenario (solo admin)

```
POST http://localhost:3000/escenarios
```
```json
{
  "nombre": "Cancha Sintetica Los Campeones",
  "deporte": "Futbol",
  "capacidadMaxima": 22,
  "horaApertura": "08:00",
  "horaCierre": "22:00",
  "precioPorHora": 50000,
  "duracionMinimaMinutos": 90,
  "duracionMaximaMinutos": 120
}
```

### Paso 6: Crear una reserva

```
POST http://localhost:3000/reservas
```
```json
{
  "usuarioId": 1,
  "escenarioId": 1,
  "fecha": "2026-04-20",
  "horaInicio": "10:00",
  "horaFin": "12:00",
  "cantidadPersonas": 10
}
```

### Paso 7: Procesar el pago

```
POST http://localhost:3000/pagos/procesar
```
```json
{
  "reservaId": 1,
  "monto": 100000,
  "metodoPago": "tarjeta"
}
```

Cuando el pago se procesa, llega un mensaje de WhatsApp al numero registrado confirmando la reserva.

---

## 8. Validaciones implementadas

### Traslape de horarios
Si un escenario ya esta reservado de 10:00 a 12:00, no se puede crear otra reserva que se cruce con ese horario. Por ejemplo intentar reservar de 11:00 a 13:00 devuelve un error.

### Horario del escenario
Cada escenario tiene una hora de apertura y cierre. No se pueden crear reservas fuera de ese rango.

### Capacidad de personas
Cada escenario tiene una capacidad maxima. Si se intenta reservar con mas personas de las permitidas, el sistema lo rechaza.

### Duracion minima y maxima por deporte
Cada escenario tiene una duracion minima y maxima de reserva en minutos. Por ejemplo un escenario de futbol puede tener minimo 90 minutos y maximo 120 minutos.

### Doble factor de autenticacion
La primera vez que un usuario inicia sesion, el sistema envia un codigo de 6 digitos al correo. El usuario debe verificar ese codigo para obtener el token. En los siguientes inicios de sesion ya no se pide el codigo.

### Token JWT de 5 minutos
El access_token expira en 5 minutos. Para renovarlo se usa el refresh_token con el endpoint `/auth/refresh-token`.

---

## 9. Seguridad

- Las contrasenas se guardan encriptadas con bcrypt
- Las rutas estan protegidas con Jwt
- Los roles admin y cliente controlan el acceso a ciertos endpoints
- El doble factor solo se pide en el primer inicio de sesion

---

## 10. Estructura del proyecto

```
src/
- auth/               # Autenticacion, JWT, guards, doble factor
- common/             # Servicio de correo
- escenarios/         # CRUD de escenarios deportivos
- pagos/              # Procesamiento de pagos
- reservas/           # CRUD de reservas con validaciones
- twilio/             # Servicio de WhatsApp
-usuarios/           # CRUD de usuarios y roles
```