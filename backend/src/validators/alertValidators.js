const Joi = require('joi');

const alertSchema = Joi.object({
  trackedProductId: Joi.string().required(),
  channel: Joi.string().valid('sms', 'email').default('sms'),
  threshold: Joi.number().positive().required()
});

module.exports = {
  alertSchema
};
