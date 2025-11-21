const { verifyToken } = require('../utils/jwt');
const { unauthorized } = require('../utils/errorHandler');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw unauthorized();
    }
    const token = header.replace('Bearer ', '');
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(unauthorized());
  }
};
