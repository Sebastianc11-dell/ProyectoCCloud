const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = {
  notFound,
  errorHandler
};
