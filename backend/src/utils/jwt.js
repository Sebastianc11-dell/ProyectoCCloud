const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (payload, expiresIn = '7d') => jwt.sign(payload, env.jwtSecret, { expiresIn });

const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

module.exports = {
  signToken,
  verifyToken
};
