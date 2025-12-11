const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const RETRYABLE_ERRORS = new Set(['ECONNRESET', 'PROTOCOL_CONNECTION_LOST']);

const query = async (sql, params = [], attempt = 0) => {
  try {
    return await pool.execute(sql, params);
  } catch (error) {
    if (RETRYABLE_ERRORS.has(error.code) && attempt < 2) {
      logger.warn('MySQL connection lost, retrying query', {
        code: error.code,
        attempt: attempt + 1
      });
      return query(sql, params, attempt + 1);
    }
    throw error;
  }
};

module.exports = {
  pool,
  query
};
