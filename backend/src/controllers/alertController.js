const alertService = require('../services/alertService');

exports.createAlert = async (req, res, next) => {
  try {
    const alert = await alertService.createAlert(req.user.id, req.body);
    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
};

exports.listAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.listAlerts(req.user.id);
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

exports.deleteAlert = async (req, res, next) => {
  try {
    await alertService.deleteAlert(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
