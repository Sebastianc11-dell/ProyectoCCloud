const priceMonitorService = require('../services/priceMonitorService');

exports.addTrackedProduct = async (req, res, next) => {
  try {
    const trackedProduct = await priceMonitorService.trackProduct(req.user.id, req.body);
    res.status(201).json(trackedProduct);
  } catch (error) {
    next(error);
  }
};

exports.removeTrackedProduct = async (req, res, next) => {
  try {
    await priceMonitorService.untrackProduct(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.listTrackedProducts = async (req, res, next) => {
  try {
    const tracked = await priceMonitorService.listTrackedProducts(req.user.id);
    res.json(tracked);
  } catch (error) {
    next(error);
  }
};
