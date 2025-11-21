const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  mercadolibreBaseUrl: process.env.MERCADOLIBRE_BASE_URL || 'https://api.mercadolibre.com',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'AC0029dd4e1093dfbf0f32824277321a73',
    authToken: process.env.TWILIO_AUTH_TOKEN || '976fe6c4f8959f1a3f5f71c8dbb171da',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '+15206360599',
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || 'MG6e8cf703149b55e63eb7e33431371cc2'
  },
  db: {
    host: process.env.DB_HOST || '34.176.159.252',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'master',
    password: process.env.DB_PASS || '@BaseAsistencia11',
    database: process.env.DB_NAME || 'price_monitor'
  }
};

module.exports = env;
