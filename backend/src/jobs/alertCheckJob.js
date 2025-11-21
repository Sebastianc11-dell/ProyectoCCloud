const cron = require('node-cron');
const { query } = require('../config/mysql');
const twilioService = require('../services/twilioService');
const logger = require('../utils/logger');

const formatPeruPhone = (raw) => {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('51') && digits.length === 11) {
    return `+${digits}`;
  }
  if (digits.startsWith('9') && digits.length === 9) {
    return `+51${digits}`;
  }
  if (raw.startsWith('+51')) {
    return raw;
  }
  return null;
};

// Revisa cada minuto si el precio del producto es menor o igual al objetivo del tracking
const startAlertCheckJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const [rows] = await query(
        `SELECT tp.id AS tracked_id, tp.target_price, p.title, p.price, u.phone, u.email
         FROM tracked_products tp
         JOIN products p ON p.id = tp.product_id
         JOIN users u ON u.id = tp.user_id
         WHERE tp.is_active = 1
           AND p.price IS NOT NULL
           AND p.price <= tp.target_price`
      );

      for (const row of rows) {
        const to = formatPeruPhone(row.phone);
        if (!to) {
          logger.warn('No phone number for user; skipping alert', { tracked_id: row.tracked_id, email: row.email });
          continue;
        }
        const body = `Alerta: ${row.title} bajo a ${row.price} (tu objetivo: ${row.target_price})`;
        await twilioService.sendSms(to, body);
        // evita notificar repetidamente: desactiva el tracking tras enviar
        await query('UPDATE tracked_products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
          row.tracked_id
        ]);
      }
    } catch (error) {
      logger.error('Alert check job failed', { message: error.message });
    }
  });
};

module.exports = startAlertCheckJob;
