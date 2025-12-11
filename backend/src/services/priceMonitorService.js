const { query } = require('../config/mysql');
const alertService = require('./alertService');
const { AppError } = require('../utils/errorHandler');

const ensureProduct = async ({ externalId, productId }) => {
  if (productId) {
    const [byId] = await query('SELECT * FROM products WHERE id = ?', [productId]);
    if (byId.length > 0) return byId[0];
  }
  if (externalId) {
    const [byExternal] = await query('SELECT * FROM products WHERE external_id = ?', [externalId]);
    if (byExternal.length > 0) return byExternal[0];
  }
  throw new AppError('Product not found', 404);
};

const getTrackedForUser = async (trackedId, userId) => {
  const [rows] = await query(
    `SELECT tp.*, p.title, p.external_id, p.currency, p.permalink, p.thumbnail
     FROM tracked_products tp
     JOIN products p ON p.id = tp.product_id
     WHERE tp.id = ? AND tp.user_id = ?`,
    [trackedId, userId]
  );
  if (rows.length === 0) {
    throw new AppError('Tracked product not found', 404);
  }
  return rows[0];
};

exports.trackProduct = async (userId, { externalId, productId, targetPrice }) => {
  const product = await ensureProduct({ externalId, productId });
  await query(
    `INSERT INTO tracked_products (user_id, product_id, target_price, is_active)
     VALUES (?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE target_price = VALUES(target_price), is_active = 1, updated_at = CURRENT_TIMESTAMP`,
    [userId, product.id, targetPrice]
  );

  const [rows] = await query(
    `SELECT tp.*, p.title, p.external_id, p.currency, p.permalink, p.thumbnail
     FROM tracked_products tp
     JOIN products p ON p.id = tp.product_id
     WHERE tp.user_id = ? AND tp.product_id = ?`,
    [userId, product.id]
  );
  const tracked = rows[0];

  const [existingAlerts] = await query('SELECT id FROM alerts WHERE tracked_product_id = ?', [tracked.id]);
  if (existingAlerts.length === 0) {
    await query(
      'INSERT INTO alerts (tracked_product_id, channel, threshold, is_active) VALUES (?, ?, ?, 1)',
      [tracked.id, 'sms', targetPrice]
    );
  }

  return tracked;
};

exports.untrackProduct = async (userId, trackedId) => {
  const tracked = await getTrackedForUser(trackedId, userId);
  await query('DELETE FROM tracked_products WHERE id = ?', [tracked.id]);
  // price_history and alerts cascade if foreign keys set; otherwise:
  await query('DELETE FROM price_history WHERE tracked_product_id = ?', [tracked.id]);
  await query('DELETE FROM alerts WHERE tracked_product_id = ?', [tracked.id]);
};

exports.listTrackedProducts = async (userId) => {
  const [rows] = await query(
    `SELECT tp.*, p.title, p.external_id, p.currency, p.permalink, p.thumbnail
     FROM tracked_products tp
     JOIN products p ON p.id = tp.product_id
     WHERE tp.user_id = ? AND tp.is_active = 1`,
    [userId]
  );
  return rows;
};

exports.getPriceHistory = async (userId, trackedId) => {
  await getTrackedForUser(trackedId, userId);
  const [rows] = await query(
    'SELECT id, price, currency, created_at FROM price_history WHERE tracked_product_id = ? ORDER BY created_at ASC',
    [trackedId]
  );
  return rows;
};

exports.getLatestPrice = async (userId, trackedId) => {
  await getTrackedForUser(trackedId, userId);
  const [rows] = await query(
    'SELECT id, price, currency, created_at FROM price_history WHERE tracked_product_id = ? ORDER BY created_at DESC LIMIT 1',
    [trackedId]
  );
  return rows[0] || null;
};

exports.recordPriceSnapshot = async (trackedProduct, currentPrice, currency = 'USD') => {
  if (typeof currentPrice !== 'number') {
    throw new AppError('Price information unavailable', 400);
  }
  await query(
    'INSERT INTO price_history (tracked_product_id, price, currency) VALUES (?, ?, ?)',
    [trackedProduct.id, currentPrice, currency]
  );
  // opcional: mantener sincronizado el precio visible en products
  await query('UPDATE products SET price = ? WHERE id = ?', [currentPrice, trackedProduct.product_id || trackedProduct.productId]);
  await alertService.evaluateAlerts(trackedProduct.id, currentPrice);
};
