# Price Monitor Backend

API backend construido con Node.js, Express y MongoDB para registrar productos, rastrear precios y enviar alertas con Twilio.

## Requisitos
- Node.js >= 18
- MongoDB local o remoto

## Instalación
```bash
cd backend
npm install
```

## Ejecución
```bash
npm run dev
```

## Variables de entorno
Copiar `.env.example` a `.env` y completar los valores necesarios (MongoDB, JWT, Twilio, etc.).

## Scripts principales
- `npm run dev`: inicia el servidor con nodemon.
- `npm start`: inicia el servidor en producción.
- `npm run lint`: ejecuta ESLint.

## Estructura
La carpeta `src/` contiene configuraciones, modelos, controladores, servicios, rutas, middleware, validadores, utilidades y trabajos programados tal como se solicitó.
