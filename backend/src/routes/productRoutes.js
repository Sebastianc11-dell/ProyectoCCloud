const { Router } = require('express');
const productController = require('../controllers/productController');
const validate = require('../middleware/validationMiddleware');
const { searchSchema } = require('../validators/productValidators');

const router = Router();

router.get('/', validate(searchSchema, 'query', true), productController.searchProducts);
router.get('/search', validate(searchSchema, 'query', true), productController.searchProducts);
router.get('/:id', productController.getProductDetail);

module.exports = router;
