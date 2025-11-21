const { Schema, model, Types } = require('mongoose');
const { alertChannels } = require('../config/constants');

const alertSchema = new Schema(
  {
    trackedProduct: { type: Types.ObjectId, ref: 'TrackedProduct', required: true },
    channel: { type: String, enum: Object.values(alertChannels), default: alertChannels.SMS },
    threshold: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    lastNotifiedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = model('Alert', alertSchema);
