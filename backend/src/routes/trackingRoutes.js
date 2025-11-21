const { Router } = require('express');
const trackingController = require('../controllers/trackingController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { trackProductSchema } = require('../validators/productValidators');

const router = Router();

router.use(auth);
router.get('/', trackingController.listTrackedProducts);
router.post('/', validate(trackProductSchema), trackingController.addTrackedProduct);
router.delete('/:id', trackingController.removeTrackedProduct);

module.exports = router;
