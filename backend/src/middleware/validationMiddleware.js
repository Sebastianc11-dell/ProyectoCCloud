module.exports = (schema, property = 'body', optional = false) => (req, res, next) => {
  const data = req[property];
  const hasPayload = data && Object.keys(data).length > 0;

  if (optional && !hasPayload) {
    return next();
  }

  const { error, value } = schema.validate(data, { abortEarly: false, allowUnknown: false });
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }
  req[property] = value;
  return next();
};
