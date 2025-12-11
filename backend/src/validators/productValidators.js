const Joi = require('joi');

const trackProductSchema = Joi.object({
  externalId: Joi.string().optional(),
  productId: Joi.number().integer().positive().optional(),
  targetPrice: Joi.number().positive().required()
}).or('externalId', 'productId');

const searchSchema = Joi.object({
  query: Joi.string().min(2)
});

const importProductSchema = Joi.object({
  url: Joi.string().uri().required()
});

module.exports = {
  trackProductSchema,
  searchSchema,
  importProductSchema
};
