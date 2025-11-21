const { query } = require('../config/mysql');
const twilioService = require('./twilioService');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errorHandler');

exports.createAlert = async (userId, { trackedProductId, channel, threshold }) => {
  const [tracked] = await query('SELECT id FROM tracked_products WHERE id = ? AND user_id = ?', [
    trackedProductId,
    userId
  ]);
  if (tracked.length === 0) {
    throw new AppError('Tracked product not found', 404);
  }

  const [result] = await query(
    'INSERT INTO alerts (tracked_product_id, channel, threshold, is_active) VALUES (?, ?, ?, 1)',
    [trackedProductId, channel, threshold]
  );

  const [rows] = await query(
    `SELECT a.*, tp.user_id, p.title, p.external_id
     FROM alerts a
     JOIN tracked_products tp ON tp.id = a.tracked_product_id
     JOIN products p ON p.id = tp.product_id
     WHERE a.id = ?`,
    [result.insertId]
  );
  return rows[0];
};

exports.listAlerts = async (userId) => {
  const [rows] = await query(
    `SELECT a.*, p.title, p.external_id, tp.target_price
     FROM alerts a
     JOIN tracked_products tp ON tp.id = a.tracked_product_id
     JOIN products p ON p.id = tp.product_id
     WHERE tp.user_id = ?`,
    [userId]
  );
  return rows;
};

exports.deleteAlert = async (userId, alertId) => {
  const [rows] = await query(
    `SELECT a.id
     FROM alerts a
     JOIN tracked_products tp ON tp.id = a.tracked_product_id
     WHERE a.id = ? AND tp.user_id = ?`,
    [alertId, userId]
  );
  if (rows.length === 0) {
    throw new AppError('Alert not found', 404);
  }
  await query('DELETE FROM alerts WHERE id = ?', [alertId]);
};

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

exports.evaluateAlerts = async (trackedProductId, currentPrice) => {
  const [alerts] = await query(
    `SELECT a.*, u.email, u.phone, p.title
     FROM alerts a
     JOIN tracked_products tp ON tp.id = a.tracked_product_id
     JOIN users u ON u.id = tp.user_id
     JOIN products p ON p.id = tp.product_id
     WHERE a.tracked_product_id = ? AND a.is_active = 1 AND a.threshold >= ?`,
    [trackedProductId, currentPrice]
  );

  await Promise.all(
    alerts.map(async (alert) => {
      const to = formatPeruPhone(alert.phone);
      if (alert.channel === 'sms' && to) {
        const body = `Alerta: ${alert.title} bajo a ${currentPrice} (tu objetivo: ${alert.threshold})`;
        await twilioService.sendSms(to, body);
      } else {
        logger.info('Alert triggered', { user: alert.email, product: alert.title, currentPrice });
      }
      await query('UPDATE alerts SET is_active = 0, last_notified_at = NOW() WHERE id = ?', [alert.id]);
    })
  );
};
