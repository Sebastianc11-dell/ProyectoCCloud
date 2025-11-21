const { Schema, model, Types } = require('mongoose');

const priceHistorySchema = new Schema(
  {
    trackedProduct: { type: Types.ObjectId, ref: 'TrackedProduct', required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'ARS' }
  },
  { timestamps: true }
);

module.exports = model('PriceHistory', priceHistorySchema);
