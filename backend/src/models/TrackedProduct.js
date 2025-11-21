const { Schema, model, Types } = require('mongoose');

const trackedProductSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    targetPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

trackedProductSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = model('TrackedProduct', trackedProductSchema);
