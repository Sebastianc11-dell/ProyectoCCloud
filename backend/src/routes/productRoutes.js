const { Router } = require('express');
const productController = require('../controllers/productController');
const validate = require('../middleware/validationMiddleware');
const auth = require('../middleware/authMiddleware');
const { searchSchema, importProductSchema } = require('../validators/productValidators');

const router = Router();

// Todas las rutas de productos quedan protegidas para devolver solo datos del usuario autenticado
router.use(auth);

router.get('/', validate(searchSchema, 'query', true), productController.searchProducts);
router.get('/search', validate(searchSchema, 'query', true), productController.searchProducts);
router.post('/import', validate(importProductSchema), productController.importProduct);
router.get('/:id', productController.getProductDetail);

module.exports = router;
