const { query } = require('../config/mysql');
const { AppError } = require('../utils/errorHandler');

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
