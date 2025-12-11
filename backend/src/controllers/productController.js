const { query } = require('../config/mysql');
const { AppError } = require('../utils/errorHandler');
const amazonService = require('../services/amazonService');
const priceMonitorService = require('../services/priceMonitorService');
const { roles } = require('../config/constants');

const mapProduct = (row) => ({
  id: row.id,
  externalId: row.external_id,
  title: row.title,
  permalink: row.permalink,
  thumbnail: row.thumbnail,
  currency: row.currency,
  status: row.status,
  price: row.price,
  priceCurrency: row.currency
});

exports.searchProducts = async (req, res, next) => {
  try {
    const term = req.query.query?.trim().toLowerCase();
    const [rows] = await query(
      `SELECT p.*
       FROM products p
       WHERE (? IS NULL OR LOWER(p.title) LIKE CONCAT('%', ?, '%'))`,
      [term || null, term || null]
    );
    res.json(rows.map(mapProduct));
  } catch (error) {
    next(error);
  }
};

exports.getProductDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await query(`SELECT p.* FROM products p WHERE p.id = ?`, [id]);
    if (rows.length === 0) {
      throw new AppError('Product not found', 404);
    }
    res.json(mapProduct(rows[0]));
  } catch (error) {
    next(error);
  }
};

const importLimits = {
  [roles.ADMIN]: Infinity,
  [roles.PREMIUM]: 20,
  [roles.USER]: 3
};

const canImportNewProduct = async (userId, role) => {
  const limit = importLimits[role] ?? importLimits[roles.USER];
  if (!isFinite(limit)) {
    return true;
  }
  const [rows] = await query('SELECT COUNT(*) AS count FROM products WHERE created_by = ?', [userId]);
  const count = rows[0]?.count || 0;
  return count < limit;
};

exports.importProduct = async (req, res, next) => {
  try {
    const { url } = req.body;
    const info = await amazonService.getAmazonBasicInfo(url);
    if (!info?.price || !info?.name) {
      throw new AppError('No se pudo obtener la informacion del producto', 400);
    }
    const asin = info.asin || amazonService.extractAsin(info.canonicalUrl || url);
    if (!asin) {
      throw new AppError('No se pudo determinar el identificador del producto', 400);
    }

    const [userRows] = await query('SELECT role FROM users WHERE id = ?', [req.user.id]);
    const userRole = userRows[0]?.role || roles.USER;

    const [existing] = await query('SELECT * FROM products WHERE external_id = ?', [asin]);
    let productId;
    let isNew = false;

    if (existing.length > 0) {
      productId = existing[0].id;
      await query(
        'UPDATE products SET title = ?, permalink = ?, thumbnail = ?, price = ?, currency = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [info.name, info.canonicalUrl || url, info.image, info.price, info.currency || 'USD', productId],
      );
    } else {
      const allowed = await canImportNewProduct(req.user.id, userRole);
      if (!allowed) {
        throw new AppError('Has alcanzado el limite de importaciones para tu cuenta', 403);
      }
      const [insert] = await query(
        'INSERT INTO products (external_id, title, permalink, thumbnail, price, currency, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [asin, info.name, info.canonicalUrl || url, info.image, info.price, info.currency || 'USD', 'active', req.user.id],
      );
      productId = insert.insertId;
      isNew = true;
    }

    const [tracked] = await query('SELECT id, product_id FROM tracked_products WHERE product_id = ?', [productId]);
    for (const t of tracked) {
      await priceMonitorService.recordPriceSnapshot(
        { id: t.id, product_id: t.product_id },
        info.price,
        info.currency || 'USD',
      );
    }

    const [productRows] = await query('SELECT * FROM products WHERE id = ?', [productId]);
    res.json({ product: mapProduct(productRows[0]), isNew });
  } catch (error) {
    next(error);
  }
};
