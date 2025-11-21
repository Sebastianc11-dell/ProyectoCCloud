const { Schema, model } = require('mongoose');
const { roles } = require('../config/constants');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: Object.values(roles), default: roles.USER }
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
