const Joi = require('joi');

const trackProductSchema = Joi.object({
  externalId: Joi.string().optional(),
  productId: Joi.number().integer().positive().optional(),
  targetPrice: Joi.number().positive().required()
}).or('externalId', 'productId');

const searchSchema = Joi.object({
  query: Joi.string().min(2)
});

module.exports = {
  trackProductSchema,
  searchSchema
};
