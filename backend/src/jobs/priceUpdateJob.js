const cron = require('node-cron');
const { query } = require('../config/mysql');
const priceMonitorService = require('../services/priceMonitorService');
const amazonService = require('../services/amazonService');
const logger = require('../utils/logger');

const startPriceUpdateJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const [products] = await query('SELECT id, permalink FROM products WHERE status = "active"');
      for (const product of products) {
        if (!product.permalink) {
          continue;
        }
        try {
          const info = await amazonService.getAmazonBasicInfo(product.permalink);
          if (!info?.price) {
            continue;
          }
          await query('UPDATE products SET price = ?, currency = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
            info.price,
            info.currency || 'USD',
            product.id
          ]);
          const [tracked] = await query('SELECT id, product_id FROM tracked_products WHERE product_id = ?', [product.id]);
          for (const t of tracked) {
            await priceMonitorService.recordPriceSnapshot(
              { id: t.id, product_id: t.product_id },
              info.price,
              info.currency || 'USD'
            );
          }
        } catch (err) {
          logger.error('Failed to update product price', { productId: product.id, message: err.message });
        }
      }
    } catch (error) {
      logger.error('Price update job failed', { message: error.message });
    }
  });
};

module.exports = startPriceUpdateJob;
