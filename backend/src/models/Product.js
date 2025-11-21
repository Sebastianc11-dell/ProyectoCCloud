const { Schema, model } = require('mongoose');
const { productStatus } = require('../config/constants');

const productSchema = new Schema(
  {
    externalId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    permalink: { type: String },
    thumbnail: { type: String },
    currency: { type: String, default: 'ARS' },
    status: { type: String, enum: Object.values(productStatus), default: productStatus.ACTIVE }
  },
  { timestamps: true }
);

module.exports = model('Product', productSchema);
