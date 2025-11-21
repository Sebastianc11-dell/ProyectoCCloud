const priceMonitorService = require('../services/priceMonitorService');

exports.getHistory = async (req, res, next) => {
  try {
    const history = await priceMonitorService.getPriceHistory(req.user.id, req.params.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

exports.getLatestPrice = async (req, res, next) => {
  try {
    const price = await priceMonitorService.getLatestPrice(req.user.id, req.params.id);
    res.json(price);
  } catch (error) {
    next(error);
  }
};
