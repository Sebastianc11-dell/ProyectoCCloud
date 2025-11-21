class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const notFound = (resource = 'Resource') => new AppError(`${resource} not found`, 404);
const unauthorized = (message = 'Unauthorized') => new AppError(message, 401);

module.exports = {
  AppError,
  notFound,
  unauthorized
};
