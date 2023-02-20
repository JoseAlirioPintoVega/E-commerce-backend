const { Router } = require('express');
const { check } = require('express-validator');
const {
  addProductToCart,
  updateCart,
  removeProductToCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/aut.middleware');
const {
  validExistCart,
  ValidExistProductInCart,
  validExistProductInCartForUpdate,
  validExistProductIdByParams,
  validExitProductInCartByParamsForUpdate,
} = require('../middlewares/cart.middleware');
const {
  valideBodyProductById,
  validIfExistProductsInStock,
  validExistProductInStockForUpdate,
} = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.use(protect);

router.post(
  '/add-product',
  [
    check('productId', 'The productId is required').not().isEmpty(),
    check('productId', 'The productId is number').isNumeric(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'the quantity must be a number').isNumeric(),
    validateFields,
  ],
  valideBodyProductById,
  validIfExistProductsInStock,
  validExistCart,
  ValidExistProductInCart,
  addProductToCart
);

router.patch(
  '/update-cart',
  [
    check('productId', 'The productId is required').not().isEmpty(),
    check('productId', 'The productId is number').isNumeric(),
    check('newQty', 'The quantity is required').not().isEmpty(),
    check('newQty', 'the quantity must be a number').isNumeric(),
    validateFields,
  ],
  valideBodyProductById,
  validExistProductInStockForUpdate,
  validExistProductInCartForUpdate,
  updateCart
);
router.delete(
  '/:productId',
  validExistProductIdByParams,
  validExitProductInCartByParamsForUpdate,
  removeProductToCart
);
module.exports = { cartRouter: router };
