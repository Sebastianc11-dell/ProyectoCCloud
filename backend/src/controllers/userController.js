const { query } = require('../config/mysql');

exports.getProfile = async (req, res, next) => {
  try {
    const [rows] = await query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0] || null);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = [];
    const params = [];
    if (req.body.name) {
      updates.push('name = ?');
      params.push(req.body.name);
    }
    if (req.body.phone) {
      updates.push('phone = ?');
      params.push(req.body.phone);
    }
    if (updates.length === 0) {
      const [rows] = await query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.user.id]);
      return res.json(rows[0] || null);
    }
    params.push(req.user.id);
    await query(`UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params);
    const [rows] = await query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0] || null);
  } catch (error) {
    next(error);
  }
};
