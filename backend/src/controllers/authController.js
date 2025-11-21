const authService = require('../services/authService');

const handleResponse = (res, data, status = 200) => res.status(status).json(data);

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    handleResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    handleResponse(res, token);
  } catch (error) {
    next(error);
  }
};
