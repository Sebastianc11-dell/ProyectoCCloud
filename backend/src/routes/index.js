const { Router } = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const trackingRoutes = require('./trackingRoutes');
const priceRoutes = require('./priceRoutes');
const alertRoutes = require('./alertRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/tracking', trackingRoutes);
router.use('/prices', priceRoutes);
router.use('/alerts', alertRoutes);

module.exports = router;
