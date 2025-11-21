const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/mysql');
const startPriceUpdateJob = require('./jobs/priceUpdateJob');
const startAlertCheckJob = require('./jobs/alertCheckJob');

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      startPriceUpdateJob();
      startAlertCheckJob();
    });
  } catch (err) {
    console.error('Failed to connect to MySQL:', err.message);
    process.exit(1);
  }
};

startServer();
