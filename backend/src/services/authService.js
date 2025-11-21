const { query } = require('../config/mysql');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { signToken } = require('../utils/jwt');
const { AppError } = require('../utils/errorHandler');

const sanitizeUser = (row) => {
  if (!row) return null;
  const { password, ...rest } = row;
  return rest;
};

exports.register = async ({ name, email, password, phone }) => {
  const [existing] = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new AppError('Email already registered', 409);
  }

  const hashed = await hashPassword(password);
  const [result] = await query(
    'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
    [name, email, hashed, phone]
  );

  const userId = result.insertId;
  const [rows] = await query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [userId]);
  const user = rows[0];

  const token = signToken({ id: user.id, email: user.email });
  return { user: sanitizeUser(user), token };
};

exports.login = async ({ email, password }) => {
  const [rows] = await query('SELECT id, name, email, phone, role, password FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken({ id: user.id, email: user.email });
  return { user: sanitizeUser(user), token };
};
