const { Router } = require('express');
const priceController = require('../controllers/priceController');
const auth = require('../middleware/authMiddleware');

const router = Router();

router.use(auth);
// Frontend expects GET /api/prices/:productId to return history
router.get('/:id', priceController.getHistory);
router.get('/:id/history', priceController.getHistory);
router.get('/:id/latest', priceController.getLatestPrice);

module.exports = router;
