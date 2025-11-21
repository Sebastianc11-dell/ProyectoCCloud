const cron = require('node-cron');
const { query } = require('../config/mysql');
const priceMonitorService = require('../services/priceMonitorService');
const logger = require('../utils/logger');

const startPriceUpdateJob = () => {
  cron.schedule('*/30 * * * *', async () => {
    try {
      // Sin fuente externa de precios, no tomamos snapshots automáticos.
      logger.info('Price update job skipped (no external price source configured)');
    } catch (error) {
      logger.error('Price update job failed', { message: error.message });
    }
  });
};

module.exports = startPriceUpdateJob;
