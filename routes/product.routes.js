const { Router } = require('express');
const { check } = require('express-validator');
const {
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductById,
} = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middlewares/aut.middleware');
const { verifyProductById } = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');
const {
  createProductValidation,
} = require('../middlewares/validations.middleware');
const { upload } = require('../utils/multer');

const router = Router();

router.get('/', findProduct);

router.get('/:id', verifyProductById, findProductById);

router.use(protect);

router.post(
  '/',
  upload.array('productImgs', 3),
  createProductValidation,
  validateFields,
  restrictTo('admin'),
  createProduct
);

router.patch('/:id', verifyProductById, restrictTo('admin'), updateProduct);

router.delete('/:id', verifyProductById, restrictTo('admin'), deleteProduct);

module.exports = {
  productRouter: router,
};
