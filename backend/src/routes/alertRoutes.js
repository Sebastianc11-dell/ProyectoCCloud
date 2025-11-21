const { Router } = require('express');
const alertController = require('../controllers/alertController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { alertSchema } = require('../validators/alertValidators');

const router = Router();

router.use(auth);
router.get('/', alertController.listAlerts);
router.post('/', validate(alertSchema), alertController.createAlert);
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
