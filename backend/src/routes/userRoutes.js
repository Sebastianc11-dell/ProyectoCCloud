const { Router } = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = Router();

router.get('/me', auth, userController.getProfile);
router.patch('/me', auth, userController.updateProfile);

module.exports = router;
