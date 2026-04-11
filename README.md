# ⚽ API de Reservas Deportivas - Módulo de Pagos y Notificaciones (Estudiante C)

Este repositorio contiene el backend de un sistema de reservas deportivas construido con **NestJS**. Este submódulo en específico gestiona el procesamiento de pagos, el cálculo de totales recaudados y la integración con **Twilio** para notificaciones automáticas vía WhatsApp.

---

## 📦 1. Dependencias Instaladas

Para que este módulo funcione correctamente, se instalaron las siguientes librerías adicionales en el proyecto de NestJS:

**1. TypeORM y MySQL** (Para la conexión a la base de datos):
\`\`\`bash
npm install @nestjs/typeorm typeorm mysql2
\`\`\`

**2. ConfigModule** (Para leer las variables de entorno del archivo `.env`):
\`\`\`bash
npm install @nestjs/config
\`\`\`

**3. SDK de Twilio** (Para el envío de notificaciones de WhatsApp/SMS):
\`\`\`bash
npm install twilio
\`\`\`

*(Opcional) Comandos CLI de NestJS utilizados para generar la estructura:*
\`\`\`bash
nest g resource pagos
nest g module twilio
nest g service twilio
\`\`\`

---

## ⚙️ 2. Configuración del Entorno (.env)

Para correr este proyecto localmente, debes crear un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json`) y agregar las siguientes variables:

\`\`\`env
# Configuración de Base de Datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reservas_deportivas
DB_USERNAME=root
DB_PASSWORD=root

# Credenciales de Twilio
TWILIO_ACCOUNT_SID=tu_account_sid_aqui -> se las pase al grupo
TWILIO_AUTH_TOKEN=tu_auth_token_aqui -> se las pase al grupo
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
\`\`\`

---

## 🚀 3. Cómo Ejecutar el Proyecto

1. Asegúrate de tener **MySQL** corriendo en el puerto `3306`.
2. Instala los módulos de Node (si acabas de clonar el repositorio):
   \`\`\`bash
   npm install
   \`\`\`
3. Inicia el servidor en modo desarrollo:
   \`\`\`bash
   npm run start:dev
   \`\`\`
   *La base de datos creará las tablas automáticamente gracias a la opción `synchronize: true` de TypeORM.*

---

## 📡 4. Estructura de los Endpoints

A continuación, se detalla cómo interactuar con los endpoints del módulo de pagos utilizando Postman o Insomnia.

### 💳 1. Procesar Pago y Confirmar Reserva
Recibe los datos del pago, actualiza el estado de la reserva a "confirmada" en la base de datos y envía un mensaje de WhatsApp al cliente.

* **Método:** `POST`
* **URL:** `http://localhost:3000/pagos/procesar`
* **Body (JSON):**
  \`\`\`json
  {
  "reservaId": 1,
  "monto": 50000,
  "metodoPago": "tarjeta"
  }
  \`\`\`
* **Respuesta Exitosa (201 Created):**
  \`\`\`json
  {
  "message": "Pago procesado y reserva confirmada",
  "pagoId": 1
  }
  \`\`\`

### 📊 2. Obtener Totales y Estadísticas
Calcula la suma total del dinero recaudado y la cantidad de pagos procesados directamente desde la base de datos.

* **Método:** `GET`
* **URL:** `http://localhost:3000/pagos/totales`
* **Respuesta Exitosa (200 OK):**
  \`\`\`json
  {
  "mensaje": "Reporte de totales generado",
  "estadisticas": {
  "totalDineroRecaudado": 150000,
  "cantidadReservasPagadas": 3
  }
  }
  \`\`\`
* ### 🏟️ 3. Crear un Escenario Deportivo
Registra una nueva cancha o escenario disponible para ser reservado.

* **Método:** `POST`
* **URL:** `http://localhost:3000/escenarios`
* **Body (JSON):**
  \`\`\`json
  {
  "nombre": "Cancha Sintética Los Campeones",
  "deporte": "Fútbol",
  "capacidadMaxima": 14,
  "horaApertura": "08:00:00",
  "horaCierre": "22:00:00",
  "precioPorHora": 50000.00
  }
  \`\`\`

### 📅 4. Crear una Reserva
Genera una nueva reserva vinculando a un usuario con un escenario en una fecha y hora específicas. El estado inicial suele ser "pendiente".

* **Método:** `POST`
* **URL:** `http://localhost:3000/reservas`
* **Body (JSON):**
  \`\`\`json
  {
  "usuarioId": 1,
  "escenarioId": 1,
  "fecha": "2026-04-15",
  "horaInicio": "10:00:00",
  "horaFin": "11:00:00"
  }
  \`\`\`